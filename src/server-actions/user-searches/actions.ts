import { IPagination, ResponseModel } from "@/types/common";
import { ErrorResponse } from "@/helpers/error-response";
import { IUserSearches } from "@/types/find-property";
import { revalidateTag } from "next/cache";
import { fetcher } from "../fetcher";
import { userSearchesTag } from "./tags";

export const getUserSearches = async (params: {
  [key: string]: string;
}): Promise<ResponseModel<({ list: IUserSearches[] } & IPagination) | null>> => {
  try {
    const request = await fetcher<{ data: IUserSearches[] } & IPagination>(
      `properties?${new URLSearchParams({ ...params, pageSize: "6" })}`,
      {
        next: { tags: [userSearchesTag] },
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

export const removeUserSearches = async (ids: number[]): Promise<ResponseModel<({ list: IUserSearches[] } & IPagination) | null>> => {
  try {
    await fetcher<{ data: IUserSearches[] } & IPagination>(`properties/saveData`, {
      method: "DELETE",
      body: JSON.stringify({ ids: [...ids] }),
    });
    revalidateTag(userSearchesTag);
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
