"use server";

import { IPagination, ResponseModel } from "@/types/common";
import { ErrorResponse } from "@/helpers/error-response";
import { revalidateTag } from "next/cache";
import { AuthedUserSearches } from "@/types/auth";
import { z } from "zod";
import { userRecentSearchesValidations } from "@/zod-validations/filters-validations";
import { removeParcelNumberFormatting } from "@/helpers/common";
import { getCountyValue, getStateValue } from "@/helpers/states";
import { IUserRecentSearches } from "@/types/user";
import { PolygonProps } from "react-leaflet";
import moment from "moment";
import { fetcher } from "../fetcher";
import { userSearchesTag } from "./tags";

export const getUserSearches = async (
  filters: Partial<z.infer<typeof userRecentSearchesValidations>> & { page: number; pageSize: number }
): Promise<ResponseModel<({ list: IUserRecentSearches[] } & IPagination) | null>> => {
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
    const request = await fetcher<{ data: Record<string, any>[] } & IPagination>(`properties?${searchParams}`, {
      next: { tags: [userSearchesTag] },
    });

    const formattedData: IUserRecentSearches[] = request.data?.map((item) => ({
      id: item.id.toString(),
      parcelNumber: item.parcelNumber,
      parcelNumberNoFormatting: removeParcelNumberFormatting(item.parcelNumber),
      acreage: Number(item.acrage),
      county: {
        value: item.county.toLocaleLowerCase() || "",
        label: getCountyValue(item.county, item.state)?.label || item.county.toLocaleLowerCase() || "",
      },
      state: {
        value: item.state.toLocaleLowerCase() || "",
        label: getStateValue(item.state)?.label || item.state.toLocaleLowerCase() || "",
      },
      city: item.locality,
      lat: Number(item.lat),
      lon: Number(item.lon),
      owner: item.owner || "",
      polygon: JSON.parse(item.coordinates) as PolygonProps["positions"],
      propertyType: item.propertyType,
      price: Number(item.price),
      pricePerAcreage: Number((Number(item.price) / Number(item.acrage)).toFixed(2)),
      propertiesUsedForCalculation: item.assessments.map((property: any) => ({
        acreage: Number(property.arcage),
        city: property.city,
        county: {
          value: property.county,
          label: property.county,
        },
        state: {
          value: property.state,
          label: property.state,
        },
        id: removeParcelNumberFormatting(property.parselId),
        isMedianValid: property.isMedianValid,
        isValid: property.isValid,
        lastSaleDate: moment(property.lastSalesDate, "YYYY-MM-DD").toDate(),
        lastSalePrice: Number(property.lastSalesPrice),
        lat: Number(property.latitude),
        lon: Number(property.longitude),
        parcelNumber: property.parcelNumber,
        parcelNumberNoFormatting: removeParcelNumberFormatting(property.parselId),
        pricePerAcreage: Number((Number(property.lastSalesPrice) / Number(property.arcage)).toFixed(2)),
      })),
    }));
    return {
      errorMessage: null,
      data: { list: formattedData, pagination: request.pagination },
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
