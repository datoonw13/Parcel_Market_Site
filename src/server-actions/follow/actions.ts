"use server";

import { IPagination, ResponseModel } from "@/types/common";
import { ErrorResponse } from "@/helpers/error-response";
import { revalidateTag } from "next/cache";
import { ISellingProperty } from "@/types/find-property";
import { fetcher } from "../fetcher";
import { marketplaceTag } from "../marketplace/tags";
import { followTag } from "./tags";

export const getUserFollowedListingAction = async (params: {
  [key: string]: string;
}): Promise<ResponseModel<({ list: ISellingProperty[] } & IPagination) | null>> => {
  try {
    const request = await fetcher<{ data: ({ sellingProperty: ISellingProperty } & { followedListingId?: number })[] } & IPagination>(
      `followed-listings?${new URLSearchParams({ ...params, pageSize: "4" })}`,
      {
        next: { tags: [followTag] },
      }
    );
    return {
      errorMessage: null,
      data: {
        list: request.data.map((el) => ({ ...el.sellingProperty, followedListingId: el?.followedListingId })),
        pagination: request.pagination,
      },
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};

export const followLand = async (
  landId: number
): Promise<ResponseModel<{ userId: number; sellingPropertyId: number; id: number } | null>> => {
  try {
    const request = await fetcher<{ userId: number; sellingPropertyId: number; id: number }>(`followed-listings`, {
      method: "POST",
      body: JSON.stringify({ sellingPropertyId: landId }),
    });
    revalidateTag(marketplaceTag);
    revalidateTag(followTag);
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
    revalidateTag(followTag);
    return { data: request, errorMessage: null };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};
