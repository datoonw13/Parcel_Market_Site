"use server";

import { IMap } from "@/types/map";
import { ResponseModel } from "@/types/common";
import { ErrorResponse } from "@/helpers/error-response";
import { z } from "zod";
import { valueLandDetailsValidations } from "@/zod-validations/value-land-validations";
import { revalidateTag } from "next/cache";
import { PropertyPriceCalculationReq, PropertyPriceCalculationRes, PropertySellReq } from "@/types/property";
import { fetcher } from "../fetcher";
import { userListingsTag } from "../user-listings/tags";
import { marketplaceTag } from "../marketplace/tags";
import { userSearchesTag } from "../user-searches/tags";

export const getFoundedPropertiesAction = async (
  values: z.infer<typeof valueLandDetailsValidations>
): Promise<ResponseModel<IMap | null>> => {
  try {
    const reqData: { [key: string]: string } = {
      state: values.state,
      county: values.county,
    };
    if (values.type === "parcelNumber") {
      reqData.parcelNumber = values.parcelNumber!;
    }
    if (values.type === "entityName") {
      reqData.firstName = values.entityName!.toUpperCase();
    }
    if (values.type === "fullName") {
      reqData.firstName = values.firstName!;
      reqData.lastName = values.lastName!;
    }
    const apiUrl = values.type === "parcelNumber" ? "searchByStateAndCountyAndParcel" : "searchByStateAndCountyAndOwner";
    const request = await fetcher<IMap>(`regrid/${apiUrl}?${new URLSearchParams(reqData)}`, {
      next: {
        revalidate: 3600,
      },
    });
    return {
      data: request,
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
  payload: PropertyPriceCalculationReq
): Promise<ResponseModel<PropertyPriceCalculationRes | null>> => {
  try {
    const request = await fetcher<PropertyPriceCalculationRes>(`properties/calculate/price?${new URLSearchParams(payload.queryParams)}`, {
      method: "POST",
      body: JSON.stringify(payload.body),
      next: {
        revalidate: 3600,
      },
    });
    revalidateTag(userSearchesTag);
    return {
      data: request,
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
