import { IPagination, ResponseModel } from "@/types/common";
import { ErrorResponse } from "@/helpers/error-response";
import { SellingPropertyDetails } from "@/types/property";
import { fetcher } from "../fetcher";
import { marketplaceTag } from "./tags";

export const getMarketplaceListAction = async (
  pageSize: number,
  params?: {
    [key: string]: string;
  }
): Promise<ResponseModel<({ list: SellingPropertyDetails[] } & IPagination) | null>> => {
  try {
    const request = await fetcher<{ sellingProperties: SellingPropertyDetails[] } & IPagination>(
      `selling-properties/?${new URLSearchParams({ ...params, pageSize: pageSize.toString(), sellerType: "sale" })}`,
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

export const getLendDetailsAction = async (landId: string): Promise<ResponseModel<SellingPropertyDetails | null>> => {
  try {
    const request = await fetcher<SellingPropertyDetails>(`selling-properties/${landId}`, {
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
