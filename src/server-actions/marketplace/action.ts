import { IPagination, ResponseModel } from "@/types/common";
import { ErrorResponse } from "@/helpers/error-response";
import { SellingPropertyDetails } from "@/types/property";
import { z } from "zod";
import { marketplaceFiltersValidations } from "@/zod-validations/filters-validations";
import { fetcher } from "../fetcher";
import { marketplaceTag } from "./tags";

const transformFilters = <T extends {}>(data: T) => {
  const filters = Object.keys(data).reduce((acc, cur) => {
    const key = cur as keyof typeof data;
    if (data[key]) {
      return {
        ...acc,
        [key]: data[key],
      };
    }
    return { ...acc };
  }, {});
  return filters;
};

export const getMarketplaceListAction = async (
  pageSize: number,
  filters: Partial<z.infer<typeof marketplaceFiltersValidations>>
): Promise<ResponseModel<({ list: SellingPropertyDetails[] } & IPagination) | null>> => {
  try {
    const request = await fetcher<{ sellingProperties: SellingPropertyDetails[] } & IPagination>(
      `selling-properties/?${new URLSearchParams({
        ...transformFilters(filters),
        pageSize: pageSize.toString(),
        sellerType: "sale",
      }).toString()}`,
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
