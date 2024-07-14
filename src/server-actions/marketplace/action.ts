import { IPagination, ResponseModel } from "@/types/common";
import { ISellingProperty } from "@/types/find-property";
import { ErrorResponse } from "@/helpers/error-response";
import { fetcher } from "../fetcher";
import { marketplaceTags } from "./tags";

export const getMarketplaceListAction = async (params: {
  [key: string]: string;
}): Promise<ResponseModel<({ list: ISellingProperty[] } & IPagination) | null>> => {
  try {
    const request = await fetcher<{ data: ISellingProperty[] } & IPagination>(
      `selling-properties/user/properties?${new URLSearchParams({ ...params, pageSize: "6" })}`,
      {
        next: { tags: [marketplaceTags.list] },
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
