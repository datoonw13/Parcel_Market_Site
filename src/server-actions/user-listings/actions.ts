"use server";

import { IPagination, ResponseModel } from "@/types/common";
import { ErrorResponse } from "@/helpers/error-response";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SellingPropertyDetails } from "@/types/property";
import { userListingsTag } from "./tags";
import { fetcher } from "../fetcher";

export const getUserListingAction = async (params: {
  [key: string]: string;
}): Promise<ResponseModel<({ list: (SellingPropertyDetails & { offers: { id: number }[] })[] } & IPagination) | null>> => {
  try {
    const request = await fetcher<{ data: (SellingPropertyDetails & { offers: { id: number }[] })[] } & IPagination>(
      `selling-properties/user/properties?${new URLSearchParams({ ...params, pageSize: "6" })}`,
      {
        next: { tags: [userListingsTag] },
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

export const removeUserListingItemsAction = async (ids: number[]): Promise<ResponseModel<null>> => {
  try {
    await fetcher<{ data: SellingPropertyDetails[] } & IPagination>(`selling-properties/user/properties`, {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });
    return {
      errorMessage: null,
      data: null,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};

export const revalidateUserListings = async () => {
  revalidateTag(userListingsTag);
  const path = headers().get("referer");
  if (path) {
    redirect(path);
  }
};
