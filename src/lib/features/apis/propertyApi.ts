import { ResponseType } from "@/types/common";
import { IMap } from "@/types/map";
import { ICalculatePriceReq, ISearchPropertyCalculatePrice, ISearchPropertyCalculatePriceResponse } from "@/types/property";
import baseApi from "./baseApi";

const propertyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    calculatePrice: build.query<ResponseType<ISearchPropertyCalculatePriceResponse>, ISearchPropertyCalculatePrice>({
      query: (arg) => ({
        url: "properties/calculate/price",
        method: "POST",
        body: { ...arg.body },
        params: {
          ...arg.queryParams,
        },
      }),
    }),
    getRegrid: build.query<ResponseType<IMap>, ICalculatePriceReq>({
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
  }),
});

export const { useCalculatePriceQuery, useGetRegridQuery, useSignatureMutation } = propertyApi;
export default propertyApi;
