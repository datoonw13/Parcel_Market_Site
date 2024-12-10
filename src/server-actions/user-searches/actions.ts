"use server";

import { IPagination, ResponseModel } from "@/types/common";
import { ErrorResponse } from "@/helpers/error-response";
import { revalidateTag } from "next/cache";
import { AuthedUserSearches } from "@/types/auth";
import { z } from "zod";
import { userSearchesValidations } from "@/zod-validations/filters-validations";
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
  filters: Partial<z.infer<typeof userSearchesValidations>> & { page: number; pageSize: number }
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

export const getSearchDetails = async (id: number): Promise<ResponseModel<IUserRecentSearches | null>> => {
  try {
    const request = await fetcher<any>(`properties/${id}`, {
      next: { tags: [userSearchesTag] },
    });

    const formattedData: IUserRecentSearches = {
      id: request.id,
      parcelNumber: request.parcelNumber,
      createdAt: request.dateCreated,
      parcelNumberNoFormatting: removeParcelNumberFormatting(request.parcelNumber),
      acreage: Number(request.acrage),
      county: {
        value: request.county.toLocaleLowerCase() || "",
        label: getCountyValue(request.county, request.state)?.label || request.county.toLocaleLowerCase() || "",
      },
      state: {
        value: request.state.toLocaleLowerCase() || "",
        label: getStateValue(request.state)?.label || request.state.toLocaleLowerCase() || "",
      },
      city: request.locality,
      lat: Number(request.lat),
      lon: Number(request.lon),
      owner: request.owner || "",
      polygon: JSON.parse(request.coordinates) as PolygonProps["positions"],
      propertyType: request.propertyType,
      price: Number(request.price),
      pricePerAcreage: Number((Number(request.price) / Number(request.acrage)).toFixed(2)),
      propertiesUsedForCalculation: request.assessments.map((el: any) => {
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
    };

    return {
      errorMessage: null,
      data: formattedData,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};

export const getAdditionalSearchDetails = async (id: number): Promise<ResponseModel<IUserRecentSearches | null>> => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set("getAll", "true");
    const request = await fetcher<any>(`properties/${id}?${searchParams.toString()}`, {
      next: { tags: [userSearchesTag] },
    });

    const formattedData: IUserRecentSearches = {
      id: request.id,
      parcelNumber: request.parcelNumber,
      createdAt: request.dateCreated,
      parcelNumberNoFormatting: removeParcelNumberFormatting(request.parcelNumber),
      acreage: Number(request.acrage),
      county: {
        value: request.county.toLocaleLowerCase() || "",
        label: getCountyValue(request.county, request.state)?.label || request.county.toLocaleLowerCase() || "",
      },
      state: {
        value: request.state.toLocaleLowerCase() || "",
        label: getStateValue(request.state)?.label || request.state.toLocaleLowerCase() || "",
      },
      city: request.locality,
      lat: Number(request.lat),
      lon: Number(request.lon),
      owner: request.owner || "",
      polygon: JSON.parse(request.coordinates) as PolygonProps["positions"],
      propertyType: request.propertyType,
      price: Number(request.price),
      pricePerAcreage: Number((Number(request.price) / Number(request.acrage)).toFixed(2)),
      propertiesUsedForCalculation: request.assessments
        .filter((el: any) => !el.isBulked && !el.data.isMedianValid)
        .map((el: any) => {
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
    };

    return {
      errorMessage: null,
      data: formattedData,
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
