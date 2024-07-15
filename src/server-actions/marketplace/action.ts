import { IPagination, ResponseModel } from "@/types/common";
import { ISellingProperty } from "@/types/find-property";
import { ErrorResponse } from "@/helpers/error-response";
import { fetcher } from "../fetcher";
import { marketplaceTag } from "./tags";

export const getMarketplaceListAction = async (params?: {
  [key: string]: string;
}): Promise<ResponseModel<({ list: ISellingProperty[] } & IPagination) | null>> => {
  try {
    const request = await fetcher<{ sellingProperties: ISellingProperty[] } & IPagination>(
      `selling-properties/?${new URLSearchParams({ ...params, pageSize: "6", sellerType: "sale" })}`,
      {
        next: { tags: [marketplaceTag] },
      }
    );
    return {
      errorMessage: null,
      data: { list: request.sellingProperties, pagination: request.pagination },
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};

export const getLendDetailsAction = async (landId: string): Promise<ResponseModel<ISellingProperty | null>> => {
  try {
    const request = await fetcher<ISellingProperty>(`selling-properties/${landId}`, {
      next: { tags: [marketplaceTag] },
    });

    return {
      errorMessage: null,
      data: request,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};
