"use server";

import { ResponseModel } from "@/types/common";
import { ErrorResponse } from "@/helpers/error-response";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { PropertySellReq, IMainPropertyBaseInfo } from "@/types/property";
import { voltSearchSchema } from "@/zod-validations/volt";
import { removeParcelNumberFormatting } from "@/helpers/common";
import { getCounty, getState } from "@/helpers/states";
import { IVoltPriceCalculationReqParams, IVoltPriceCalculation, IVoltPriceCalculationResponse } from "@/types/volt";
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
          getCounty(property.properties.fields.county, property.properties.fields.state2)?.label ||
          property.properties.fields.county.toLocaleLowerCase(),
      },
      state: {
        value: property.properties.fields.state2.toLocaleLowerCase(),
        label: getState(property.properties.fields.state2)?.label || property.properties.fields.state2.toLocaleLowerCase(),
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
): Promise<ResponseModel<IVoltPriceCalculation | null>> => {
  let x: any = null;
  try {
    const request = await fetcher<IVoltPriceCalculationResponse>(`properties/calculate/price?${new URLSearchParams(payload.queryParams)}`, {
      method: "POST",
      body: JSON.stringify(payload.body),
      next: {
        revalidate: 3600,
      },
    });
    x = request;

    const formattedResponse: IVoltPriceCalculation = {
      id: request.id,
      parcelNumber: request.parcelNumber,
      parcelNumberNoFormatting: removeParcelNumberFormatting(request.parcelNumber),
      acreage: Number(request.acrage),
      state: {
        value: request.state.toLocaleLowerCase() || "",
        label: getState(request.state)?.label || request.state.toLocaleLowerCase() || "",
      },
      county: {
        value: request.county.toLocaleLowerCase() || "",
        label: getCounty(request.county, request.state)?.label || request.county.toLocaleLowerCase() || "",
      },
      city: request.locality,
      lat: Number(request.lat),
      lon: Number(request.lon),
      owner: request.owner,
      polygon: JSON.parse(request.coordinates),
      price: request.price,
      pricePerAcreage: request.price / Number(request.acrage),
      propertyType: request.propertyType,
      propertiesUsedForCalculation: request.properties.map((el) => {
        if (el.isBulked) {
          return {
            isBulked: true,
            data: {
              id:
                el.data.properties.length === 1
                  ? `${removeParcelNumberFormatting(el.data.properties[0].parselId)}multiple`
                  : el.data.properties.map((el) => removeParcelNumberFormatting(el.parselId)).join("multiple"),
              parcelNumber:
                el.data.properties.length === 1
                  ? `${removeParcelNumberFormatting(el.data.properties[0].parselId)}multiple`
                  : el.data.properties.map((el) => removeParcelNumberFormatting(el.parselId)).join("multiple"),
              parcelNumberNoFormatting:
                el.data.properties.length === 1
                  ? `${removeParcelNumberFormatting(el.data.properties[0].parselId)}multiple`
                  : el.data.properties.map((el) => removeParcelNumberFormatting(el.parselId)).join("multiple"),
              acreage: el.data.acreage,
              price: el.data.price,
              pricePerAcreage: el.data.pricePerAcreage,
              county: {
                value: el.data.properties[0].county,
                label: el.data.properties[0].county,
              },
              state: {
                value: el.data.properties[0].state,
                label: el.data.properties[0].state,
              },
              properties: el.data.properties.map((property) => ({
                acreage: Number(property.arcage),
                city: property.city || "",
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
                lastSaleDate: property.lastSalesDate,
                lastSalePrice: Number(property.lastSalesPrice),
                lat: Number(property.latitude),
                lon: Number(property.longitude),
                parcelNumber: property.parselId,
                parcelNumberNoFormatting: removeParcelNumberFormatting(property.parselId),
                pricePerAcreage: Number((Number(property.lastSalesPrice) / Number(property.arcage)).toFixed(2)),
              })),
            },
          };
        }
        return {
          isBulked: false,
          data: {
            acreage: Number(el.data.arcage),
            city: el.data.city || "",
            county: {
              value: el.data.county,
              label: el.data.county,
            },
            state: {
              value: el.data.state,
              label: el.data.state,
            },
            id: removeParcelNumberFormatting(el.data.parselId),
            isMedianValid: el.data.isMedianValid,
            isValid: el.data.isValid,
            lastSaleDate: el.data.lastSalesDate,
            lastSalePrice: Number(el.data.lastSalesPrice),
            lat: Number(el.data.latitude),
            lon: Number(el.data.longitude),
            parcelNumber: el.data.parselId,
            parcelNumberNoFormatting: removeParcelNumberFormatting(el.data.parselId),
            pricePerAcreage: Number((Number(el.data.lastSalesPrice) / Number(el.data.arcage)).toFixed(2)),
          },
        };
      }),
    };

    revalidateTag(userSearchesTag);
    return {
      data: formattedResponse,
      errorMessage: null,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      data: x,
      errorMessage: errorData.message,
    };
  }
};

export const calculateLandPriceAction2 = async (payload: {
  owner?: string;
  parcelNumber: string;
  propertyType: string;
  state: string;
  county: string;
  coordinates: string;
  locality: string;
  lat: string;
  lon: string;
  acrage: string;
}): Promise<ResponseModel<number | null>> => {
  try {
    const request = await fetcher<{ propertyId: number }>(`properties`, {
      method: "POST",
      body: JSON.stringify(payload),
      next: {
        revalidate: 3600,
      },
    });

    revalidateTag(userSearchesTag);
    return {
      data: request.propertyId,
      errorMessage: null,
    };
  } catch (error) {
    console.log(error, 22);

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
