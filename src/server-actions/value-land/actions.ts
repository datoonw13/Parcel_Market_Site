"use server";

import { IMap } from "@/types/map";
import { ResponseModel } from "@/types/common";
import { ErrorResponse } from "@/helpers/error-response";
import { z } from "zod";
import { valueLandDetailsValidations } from "@/zod-validations/value-land-validations";
import { fetcher } from "../fetcher";

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
