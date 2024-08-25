"use server";

import { IPagination, ResponseModel } from "@/types/common";
import { ErrorResponse } from "@/helpers/error-response";
import { revalidateTag } from "next/cache";
import { SellingPropertyDetails } from "@/types/property";
import { z } from "zod";
import { userPropertiesFiltersValidations } from "@/zod-validations/filters-validations";
import { isNil, omitBy } from "lodash";
import { fetcher } from "../fetcher";
import { marketplaceTag } from "../marketplace/tags";
import { followTag } from "./tags";

export const getUserFollowedListingAction = async (
  pageSize: number,
  params?: z.infer<typeof userPropertiesFiltersValidations>
): Promise<ResponseModel<({ list: SellingPropertyDetails[] } & IPagination) | null>> => {
  const filters = omitBy(params, isNil);
  try {
    const request = await fetcher<{ data: ({ sellingProperty: SellingPropertyDetails } & { followedListingId?: number })[] } & IPagination>(
      `followed-listings?${new URLSearchParams({ ...filters, pageSize: pageSize.toString() })}`,
      { next: { tags: [followTag] } }
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

export const unFollowLandsAction = async (
  followedListingId: number[]
): Promise<ResponseModel<{ userId: number; sellingPropertyId: number; id: number } | null>> => {
  try {
    const request = await fetcher<null>(`followed-listings`, {
      method: "DELETE",
      body: JSON.stringify({ ids: followedListingId }),
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
