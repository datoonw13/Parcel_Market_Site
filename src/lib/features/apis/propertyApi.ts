import { ResponseType } from "@/types/common";
import { IMap } from "@/types/map";
import {
  IFindPropertyEstimatedPrice,
  IFindPropertyEstimatedPriceResponse,
  IRegridReq,
  ISellProperty,
  IUserSellingPropertiesResponse,
} from "@/types/find-property";
import { ILandsMarketplaceFilters } from "@/types/lands-marketplace";
import baseApi from "./baseApi";

const propertyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    calculatePrice: build.query<ResponseType<IFindPropertyEstimatedPriceResponse>, IFindPropertyEstimatedPrice>({
      query: (arg) => ({
        url: "properties/calculate/price",
        method: "POST",
        body: { ...arg.body },
        params: {
          ...arg.queryParams,
        },
      }),
    }),
    getRegrid: build.mutation<ResponseType<IMap>, IRegridReq>({
      query: (arg) => {
        let api = "";
        if (arg.parcelNumber && arg.parcelNumber !== null) {
          api = "searchByStateAndCountyAndParcel";
        } else {
          api = "searchByStateAndCountyAndOwner";
        }

        return {
          url: `regrid/${api}`,
          method: "GET",
          params: { ...arg },
        };
      },
      transformResponse: (response: any) => {
        if (response.data) {
          response.data = response.data.filter((el: any) => el);
        }
        return response;
      },
    }),
    signature: build.mutation<ResponseType<void>, { parcelNumber: string; accepted: boolean }>({
      query: (arg) => ({
        url: "user/signature",
        method: "POST",
        body: arg,
      }),
    }),
    sellPropertyType: build.mutation<ResponseType<void>, ISellProperty>({
      query: (arg) => ({
        url: "/selling-properties",
        method: "POST",
        body: arg,
      }),
    }),
    getUserSellingProperties: build.query<IUserSellingPropertiesResponse, void>({
      query: (arg) => ({
        url: "/selling-properties/for-sale",
        method: "GET",
        body: arg,
      }),
    }),
    getSellingProperties: build.query<void, ILandsMarketplaceFilters>({
      query: (arg) => ({
        url: "/api/selling-properties",
        method: "GET",
        params: {
          ...arg,
        },
      }),
    }),
    checkParcelSellingStatus: build.mutation<ResponseType<{ data: boolean }>, string>({
      query: (parcelNumber) => ({
        url: "/selling-properties/instant-sale",
        method: "GET",
        params: {
          parcelNumber,
        },
      }),
    }),
  }),
});

export const {
  useCalculatePriceQuery,
  useLazyCalculatePriceQuery,
  useGetRegridMutation,
  useSignatureMutation,
  useSellPropertyTypeMutation,
  useGetUserSellingPropertiesQuery,
  useCheckParcelSellingStatusMutation,
  useGetSellingPropertiesQuery,
} = propertyApi;
export default propertyApi;
