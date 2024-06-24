import { IPagination, ResponseType } from "@/types/common";
import { IMap } from "@/types/map";
import {
  IFindPropertyEstimatedPrice,
  IFindPropertyEstimatedPriceResponse,
  IRegridReq,
  ISellProperty,
  ISellingProperty,
  IUserSellingPropertiesResponse,
} from "@/types/find-property";
import { ILandsFilters, ILandsMarketplaceFilters } from "@/types/lands";
import baseApi from "./baseApi";

const propertyApi = baseApi.enhanceEndpoints({ addTagTypes: ["selling-properties"] }).injectEndpoints({
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
      invalidatesTags: ["selling-properties"],
    }),
    getUserSellingProperties: build.query<IUserSellingPropertiesResponse, void>({
      query: (arg) => ({
        url: "/selling-properties/user/properties",
        method: "GET",
        body: arg,
      }),
    }),
    getSellingProperties: build.query<
      ResponseType<
        {
          sellingProperties: Array<ISellingProperty>;
        } & IPagination
      >,
      ILandsMarketplaceFilters
    >({
      query: (arg) => ({
        url: "/selling-properties",
        method: "GET",
        params: {
          ...Object.fromEntries(Object.entries(arg).filter(([_, v]) => v != null)),
        },
      }),
      providesTags: ["selling-properties"],
    }),
    getSellingProperty: build.query<ResponseType<ISellingProperty>, string>({
      query: (propertyId) => ({
        url: `/selling-properties/${propertyId}`,
        method: "GET",
      }),
      providesTags: ["selling-properties"],
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
    getUserFollowedLands: build.query<
      ResponseType<{ data: Array<{ sellingProperty: ISellingProperty; followedListingId: number }>; pagination: { totalCount: number } }>,
      Partial<ILandsFilters>
    >({
      query: (params) => ({
        url: `/followed-listings`,
        method: "GET",
        params,
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
  useGetSellingPropertyQuery,
  useGetUserFollowedLandsQuery,
} = propertyApi;
export default propertyApi;
