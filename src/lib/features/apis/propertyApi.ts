import { ISignIn, ISignInResponse, ISignUp } from "@/types/auth";
import { ResponseType } from "@/types/common";
import { ICalculatePrice, IFindPropertyAbout, IFindPropertyInfo } from "@/types/property";
import { IMap } from "@/types/map";
import baseApi from "./baseApi";

const propertyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    calculatePrice: build.mutation<ResponseType<ICalculatePrice>, IFindPropertyInfo & IFindPropertyAbout>({
      query: (arg) => ({
        url: "properties/calculate/price",
        method: "POST",
        body: arg,
      }),
    }),
    getRegrid: build.query<ResponseType<IMap>, { county?: string; parcelNumber?: number; radius: number; owner?: string }>({
      query: (arg) => ({
        url: "regrid/search",
        method: "GET",
        params: { ...arg },
      }),
    }),
  }),
});

export const { useCalculatePriceMutation, useLazyGetRegridQuery } = propertyApi;
export default propertyApi;
