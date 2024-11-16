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
import { cookies, headers } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { decode } from "jsonwebtoken";
import { userSearchesTag } from "./tags";
import { fetcher } from "../fetcher";

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
    const request = await fetcher<{ data: any[] } & IPagination>(`properties?${searchParams}`, {
      next: { tags: [userSearchesTag] },
    });

    const formattedData: IUserRecentSearches[] = request.data?.map((item) => ({
      id: item.id,
      parcelNumber: item.parcelNumber,
      createdAt: item.dateCreated,
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
      propertiesUsedForCalculation: item.assessments.map((el: any) => {
        if (el.isBulked) {
          return {
            isBulked: true,
            data: {
              id:
                el.data.properties.length === 1
                  ? `${removeParcelNumberFormatting(el.data.properties[0].parselId)}multiple`
                  : el.data.properties.map((el: any) => removeParcelNumberFormatting(el.parselId)).join("multiple"),
              parcelNumber:
                el.data.properties.length === 1
                  ? `${removeParcelNumberFormatting(el.data.properties[0].parselId)}multiple`
                  : el.data.properties.map((el: any) => removeParcelNumberFormatting(el.parselId)).join("multiple"),
              parcelNumberNoFormatting:
                el.data.properties.length === 1
                  ? `${removeParcelNumberFormatting(el.data.properties[0].parselId)}multiple`
                  : el.data.properties.map((el: any) => removeParcelNumberFormatting(el.parselId)).join("multiple"),
              acreage: el.data.properties.reduce((acc: any, cur: any) => acc + Number(cur.arcage), 0),
              price: el.data.properties.reduce((acc: any, cur: any) => acc + Number(cur.lastSalesPrice), 0),
              pricePerAcreage:
                el.data.properties.reduce((acc: any, cur: any) => acc + Number(cur.lastSalesPrice), 0) /
                el.data.properties.reduce((acc: any, cur: any) => acc + Number(cur.arcage), 0),
              county: {
                value: el.data.properties[0].county,
                label: el.data.properties[0].county,
              },
              state: {
                value: el.data.properties[0].state,
                label: el.data.properties[0].state,
              },
              properties: el.data.properties.map((property: any) => ({
                acreage: Number(property.arcage),
                city: property.city || "",
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
                lastSaleDate: property.lastSalesDate,
                lastSalePrice: Number(property.lastSalesPrice),
                lat: Number(property.latitude),
                lon: Number(property.longitude),
                parcelNumber: property.parselId,
                parcelNumberNoFormatting: removeParcelNumberFormatting(property.parselId),
                pricePerAcreage: Number((Number(property.lastSalesPrice) / Number(property.arcage)).toFixed(2)),
              })),
            },
          };
        }
        return {
          isBulked: false,
          data: {
            acreage: Number(el.data.arcage),
            city: el.data.city || "",
            county: {
              value: el.data.county,
              label: el.data.county,
            },
            state: {
              value: el.data.state,
              label: el.data.state,
            },
            id: removeParcelNumberFormatting(el.data.parselId),
            isMedianValid: el.data.isMedianValid,
            isValid: el.data.isValid,
            lastSaleDate: el.data.lastSalesDate,
            lastSalePrice: Number(el.data.lastSalesPrice),
            lat: Number(el.data.latitude),
            lon: Number(el.data.longitude),
            parcelNumber: el.data.parselId,
            parcelNumberNoFormatting: removeParcelNumberFormatting(el.data.parselId),
            pricePerAcreage: Number((Number(el.data.lastSalesPrice) / Number(el.data.arcage)).toFixed(2)),
          },
        };
      }),

      // propertiesUsedForCalculation: item.assessments.map((property: any) => ({
      //   acreage: Number(property.arcage),
      //   city: property.city,
      //   county: {
      //     value: property.county,
      //     label: property.county,
      //   },
      //   state: {
      //     value: property.state,
      //     label: property.state,
      //   },
      //   id: removeParcelNumberFormatting(property.parselId),
      //   isMedianValid: property.isMedianValid,
      //   isValid: property.isValid,
      //   lastSaleDate: moment(property.lastSalesDate, "YYYY-MM-DD").toDate(),
      //   lastSalePrice: Number(property.lastSalesPrice),
      //   lat: Number(property.latitude),
      //   lon: Number(property.longitude),
      //   parcelNumber: property.parselId,
      //   parcelNumberNoFormatting: removeParcelNumberFormatting(property.parselId),
      //   pricePerAcreage: Number((Number(property.lastSalesPrice) / Number(property.arcage)).toFixed(2)),
      // })),
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

export const checkAuth = async () => {
  try {
    const decodedAccessToken = decode(cookies().get("jwt")?.value || "") as any;
    console.log(1);

    const isAccessTokenValid =
      typeof decodedAccessToken === "object" ? moment(new Date()).isBefore(moment.unix(Number(decodedAccessToken?.exp))) : false;

    const decodedRefreshToken = decode(cookies().get("jwt-refresh")?.value || "") as any;
    console.log(3);

    const isRefreshTokenValid =
      typeof decodedRefreshToken === "object" ? moment(new Date()).isBefore(moment.unix(Number(decodedRefreshToken?.exp))) : false;
    console.log(4);

    return {
      isAccessTokenValid,
      isRefreshTokenValid,
      decodedAccessToken,
      decodedRefreshToken,
    };
  } catch (error: any) {
    return error?.message;
  }

  // if (decodedRefreshToken && isRefreshTokenValid && !isAccessTokenValid) {
  //   const { data, errorMessage } = await getAccessToken();

  //   if (data) {
  //     request.cookies.set("jwt", data);
  //   }
  //   if (errorMessage) {
  //     request.cookies.delete("jwt");
  //     request.cookies.delete("jwt-refresh");
  //   }
  // }

  // if (decodedRefreshToken && !isRefreshTokenValid) {
  //   request.cookies.delete("jwt");
  //   request.cookies.delete("jwt-refresh");
  // }
};
