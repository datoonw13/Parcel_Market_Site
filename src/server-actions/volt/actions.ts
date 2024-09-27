"use server";

import { ResponseModel } from "@/types/common";
import { ErrorResponse } from "@/helpers/error-response";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import {
  PropertyPriceCalculationReq,
  PropertyPriceCalculationRes,
  PropertySellReq,
  IPropertyBaseInfo,
  IPropertyOwner,
  IPropertyPolygon,
  IPropertyType,
  IMainPropertyBaseInfo,
} from "@/types/property";
import { voltSearchSchema } from "@/zod-validations/volt";
import { removeParcelNumberFormatting } from "@/helpers/common";
import { getCountyValue, getStateValue } from "@/helpers/states";
import { IVoltPriceCalculationReqParams, IVoltPriceCalculationRes } from "@/types/volt";
import moment from "moment";
import { PolygonProps } from "react-leaflet";
import { fetcher } from "../fetcher";
import { userListingsTag } from "../user-listings/tags";
import { marketplaceTag } from "../marketplace/tags";
import { userSearchesTag } from "../user-searches/tags";

export const getPropertiesAction = async (
  values: z.infer<typeof voltSearchSchema>
): Promise<ResponseModel<IMainPropertyBaseInfo[] | null>> => {
  try {
    const reqData: { [key: string]: string } = {
      state: values.state,
      county: values.county,
    };
    if (values.searchType === "parcelNumber") {
      reqData.parcelNumber = values.parcelNumber!;
    }
    if (values.searchType === "entityName") {
      reqData.firstName = values.entityName!.toUpperCase();
    }
    if (values.searchType === "fullName") {
      reqData.firstName = values.firstName!;
      reqData.lastName = values.lastName!;
    }
    const apiUrl = values.searchType === "parcelNumber" ? "searchByStateAndCountyAndParcel" : "searchByStateAndCountyAndOwner";
    const request = await fetcher<any[]>(`regrid/${apiUrl}?${new URLSearchParams(reqData)}`, {
      next: {
        revalidate: 3600,
      },
    });

    const formattedData: IMainPropertyBaseInfo[] = request.map((property) => ({
      id: removeParcelNumberFormatting(property.properties.fields.parcelnumb),
      parcelNumber: property.properties.fields.parcelnumb,
      parcelNumberNoFormatting: removeParcelNumberFormatting(property.properties.fields.parcelnumb),
      owner: property.properties.fields.owner,
      acreage: Number(property.properties.fields.ll_gisacre),
      city: property.properties.fields.city,
      county: {
        value: property.properties.fields.county.toLocaleLowerCase(),
        label:
          getCountyValue(property.properties.fields.county, property.properties.fields.state2)?.label ||
          property.properties.fields.county.toLocaleLowerCase(),
      },
      state: {
        value: property.properties.fields.state2.toLocaleLowerCase(),
        label: getStateValue(property.properties.fields.state2)?.label || property.properties.fields.state2.toLocaleLowerCase(),
      },
      lat: Number(property.properties.fields.lat),
      lon: Number(property.properties.fields.lon),
      polygon: property.geometry.coordinates,
      propertyType: property.properties.fields?.zoning_description || property.properties.fields.usedesc || "",
    }));

    return {
      data: formattedData,
      errorMessage: null,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      data: null,
      errorMessage: errorData.message,
    };
  }
};

export const calculateLandPriceAction = async (
  payload: IVoltPriceCalculationReqParams
): Promise<ResponseModel<IVoltPriceCalculationRes | null>> => {
  try {
    const request = await fetcher<Record<string, any>>(`properties/calculate/price?${new URLSearchParams(payload.queryParams)}`, {
      method: "POST",
      body: JSON.stringify(payload.body),
      next: {
        revalidate: 3600,
      },
    });

    const formattedData: IVoltPriceCalculationRes = {
      id: request.id.toString(),
      parcelNumber: request.parcelnumb,
      parcelNumberNoFormatting: removeParcelNumberFormatting(request.parcelNumber),
      acreage: Number(request.acrage),
      county: {
        value: request.county.toLocaleLowerCase() || "",
        label: getCountyValue(request.county, request.state)?.label || request.county.toLocaleLowerCase() || "",
      },
      state: {
        value: request.state.toLocaleLowerCase() || "",
        label: getStateValue(request.state)?.label || request.state.toLocaleLowerCase() || "",
      },
      city: request.locality,
      lat: Number(request.lat),
      lon: Number(request.lon),
      owner: request.owner || "",
      polygon: JSON.parse(request.coordinates) as PolygonProps["positions"],
      propertyType: request.propertyType,
      price: Number(request.price),
      pricePerAcreage: Number((Number(request.price) / Number(request.acrage)).toFixed(2)),
      propertiesUsedForCalculation: request.properties.map((property: any) => ({
        acreage: Number(property.arcage),
        city: property.city,
        county: {
          value: property.county,
          label: property.county,
        },
        state: {
          value: property.state,
          label: property.state,
        },
        id: removeParcelNumberFormatting(property.parselId),
        isMedianValid: property.isMedianValid,
        isValid: property.isValid,
        lastSaleDate: moment(property.lastSalesDate, "YYYY-MM-DD").toDate(),
        lastSalePrice: Number(property.lastSalesPrice),
        lat: Number(property.latitude),
        lon: Number(property.longitude),
        parcelNumber: property.parcelNumber,
        parcelNumberNoFormatting: removeParcelNumberFormatting(property.parselId),
        pricePerAcreage: Number((Number(property.lastSalesPrice) / Number(property.arcage)).toFixed(2)),
      })),
    };

    revalidateTag(userSearchesTag);
    return {
      data: formattedData,
      errorMessage: null,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      data: null,
      errorMessage: errorData.message,
    };
  }
};

export const sellLendAction = async (payload: PropertySellReq): Promise<ResponseModel<number | null>> => {
  try {
    const request = await fetcher<PropertySellReq & { id: number }>(`selling-properties`, {
      method: "POST",
      body: JSON.stringify({ ...payload, acrage: Number(payload.acrage) }),
      cache: "no-store",
    });
    revalidateTag(userListingsTag);
    revalidateTag(marketplaceTag);
    revalidateTag(userSearchesTag);
    return {
      data: request.id,
      errorMessage: null,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      data: null,
      errorMessage: errorData.message,
    };
  }
};

export const saveSearchDataAction = async (id: number): Promise<ResponseModel<null>> => {
  try {
    await fetcher<PropertySellReq & { id: number }>(`properties/saveData`, {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    revalidateTag(userSearchesTag);
    return {
      data: null,
      errorMessage: null,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      data: null,
      errorMessage: errorData.message,
    };
  }
};
