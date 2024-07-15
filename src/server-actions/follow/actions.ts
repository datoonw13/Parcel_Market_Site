"use server";

import { ResponseModel } from "@/types/common";
import { ErrorResponse } from "@/helpers/error-response";
import { revalidateTag } from "next/cache";
import { fetcher } from "../fetcher";
import { marketplaceTag } from "../marketplace/tags";

export const followLand = async (
  landId: number
): Promise<ResponseModel<{ userId: number; sellingPropertyId: number; id: number } | null>> => {
  try {
    const request = await fetcher<{ userId: number; sellingPropertyId: number; id: number }>(`followed-listings`, {
      method: "POST",
      body: JSON.stringify({ sellingPropertyId: landId }),
    });
    revalidateTag(marketplaceTag);
    return { data: request, errorMessage: null };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};

export const unFollowLand = async (
  followedListingId: number
): Promise<ResponseModel<{ userId: number; sellingPropertyId: number; id: number } | null>> => {
  try {
    const request = await fetcher<null>(`followed-listings`, {
      method: "DELETE",
      body: JSON.stringify({ ids: [followedListingId] }),
    });
    revalidateTag(marketplaceTag);
    return { data: request, errorMessage: null };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};
