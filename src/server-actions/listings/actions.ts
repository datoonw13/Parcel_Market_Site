"use server";

import { IPagination, ResponseModel } from "@/types/common";
import { ErrorResponse } from "@/helpers/error-response";
import { ISellingProperty } from "@/types/find-property";
import { fetcher } from "../fetcher";
import { listingsTags } from "./tags";

export const getUserListingAction = async (params: {
  [key: string]: string;
}): Promise<ResponseModel<({ list: ISellingProperty[] } & IPagination) | null>> => {
  try {
    const request = await fetcher<{ data: ISellingProperty[] } & IPagination>(
      `selling-properties/user/properties?${new URLSearchParams({...params, pageSize: '4'})}`,
      {
        next: { tags: [listingsTags.userListings] },
      }
    );
    return {
      errorMessage: null,
      data: { list: request.data, pagination: request.pagination },
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};
