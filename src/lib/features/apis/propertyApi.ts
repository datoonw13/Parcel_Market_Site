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
    getRegrid: build.query<ResponseType<IMap>, IFindPropertyInfo>({
      query: (arg) => {
        const { name_owner, parcelNumber, ...rest } = arg;
        let api = "";

        const params: Partial<IFindPropertyInfo> = { ...rest };
        if (parcelNumber) {
          params.parcelNumber = parcelNumber;
          api = "searchByStateAndCountyAndParcel";
        } else {
          params.name_owner = name_owner;
          api = "searchByStateAndCountyAndOwner";
        }
        return {
          url: `regrid/${api}`,
          method: "GET",
          params: { ...params },
        };
      },
    }),
  }),
});

export const { useCalculatePriceMutation, useLazyGetRegridQuery } = propertyApi;
export default propertyApi;
