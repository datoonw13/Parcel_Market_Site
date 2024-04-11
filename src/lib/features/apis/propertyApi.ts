import { ISignIn, ISignInResponse, ISignUp } from "@/types/auth";
import { ResponseType } from "@/types/common";
import { IMap } from "@/types/map";
import { ISearchPropertyCalculatePrice, ISearchPropertyCalculatePriceResponse, ISearchPropertyInfo } from "@/types/property";
import baseApi from "./baseApi";

const propertyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    calculatePrice: build.query<ResponseType<ISearchPropertyCalculatePriceResponse>, ISearchPropertyCalculatePrice>({
      query: (arg) => ({
        url: "properties/calculate/price",
        method: "POST",
        body: arg,
      }),
    }),
    getRegrid: build.query<ResponseType<IMap>, ISearchPropertyInfo>({
      query: (arg) => {
        const { owner, parcelNumber, ...rest } = arg;
        let api = "";

        const params: Partial<ISearchPropertyInfo> = { ...rest };
        if (parcelNumber) {
          params.parcelNumber = parcelNumber;
          api = "searchByStateAndCountyAndParcel";
        } else {
          params.owner = owner;
          api = "searchByStateAndCountyAndOwner";
        }
        return {
          url: `regrid/${api}`,
          method: "GET",
          params: { ...params },
        };
      },
    }),
    signature: build.mutation<ResponseType<void>, { parcelNumber: string; signature: string }>({
      query: (arg) => ({
        url: "user/signature",
        method: "POST",
        body: arg,
      }),
    }),
  }),
});

export const { useCalculatePriceQuery, useLazyGetRegridQuery, useSignatureMutation } = propertyApi;
export default propertyApi;
