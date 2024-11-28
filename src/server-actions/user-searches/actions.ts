"use server";

import { IPagination, ResponseModel } from "@/types/common";
import { ErrorResponse } from "@/helpers/error-response";
import { revalidateTag } from "next/cache";
import { AuthedUserSearches } from "@/types/auth";
import { z } from "zod";
import { userRecentSearchesValidations } from "@/zod-validations/filters-validations";
import { moneyFormatter, removeParcelNumberFormatting } from "@/helpers/common";
import { getCountyValue, getStateValue } from "@/helpers/states";
import { IUserRecentSearches } from "@/types/user";
import { PolygonProps } from "react-leaflet";
import moment from "moment";
import { cookies, headers } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { decode } from "jsonwebtoken";
import { userSearchesTag } from "./tags";
import { fetcher } from "../fetcher";

export const getUserSearches = async (
  filters: Partial<z.infer<typeof userRecentSearchesValidations>> & { page: number; pageSize: number }
): Promise<ResponseModel<({ list: { title: string; id: number }[] } & IPagination) | null>> => {
  try {
    const formattedFilters = Object.keys(filters).reduce((acc, cur) => {
      if (filters[cur as keyof typeof filters]) {
        return {
          ...acc,
          [cur]: filters[cur as keyof typeof filters]?.toString(),
        };
      }
      return {
        ...acc,
      };
    }, {});

    const searchParams = new URLSearchParams(formattedFilters);
    const request = await fetcher<{ data: any[] } & IPagination>(`properties?${searchParams}`, {
      next: { tags: [userSearchesTag] },
    });

    const data = request.data?.map((item) => {
      const state = getStateValue(item.state)?.label || item.state.toLocaleLowerCase() || "";
      const county = getCountyValue(item.county, item.state)?.label || item.county.toLocaleLowerCase() || "";
      return {
        title: `${state}/${county}/${Number(item.acrage).toFixed(2)}/${moneyFormatter.format(item.price)}`,
        id: item.id,
      };
    });

    return {
      errorMessage: null,
      data: { list: data, pagination: request.pagination },
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};

export const getSearchDetails = async (
  id: number
): Promise<ResponseModel<({ list: { title: string; id: number }[] } & IPagination) | null>> => {
  try {
    const request = await fetcher<{ data: any[] } & IPagination>(`properties/${id}`, {
      next: { tags: [userSearchesTag] },
    });

    return {
      errorMessage: null,
      data: {
        list: [],
        pagination: {
          page: 1,
          pageSize: 1,
          totalCount: 1,
        },
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

export const removeUserSearches = async (ids: number[]): Promise<ResponseModel<({ list: AuthedUserSearches[] } & IPagination) | null>> => {
  try {
    await fetcher<{ data: AuthedUserSearches[] } & IPagination>(`properties/saveData`, {
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
