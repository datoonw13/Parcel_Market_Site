import { IPagination, ResponseModel } from "@/types/common";
import { ErrorResponse } from "@/helpers/error-response";
import { ISellingProperty, IUserSearches } from "@/types/find-property";
import { fetcher } from "../fetcher";
import { userSearchesTag } from "./tags";

export const getUserSearches = async (params: {
  [key: string]: string;
}): Promise<ResponseModel<({ list: IUserSearches[] } & IPagination) | null>> => {
  try {
    const request = await fetcher<{ data: IUserSearches[] } & IPagination>(
      `properties?${new URLSearchParams({ ...params, pageSize: "16" })}`,
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
