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
    getRegrid: build.query<
      ResponseType<IMap>,
      Partial<Omit<ISearchPropertyInfo, "entityName" | "lastName" | "firstName" | "isLegalEntity">> & { owner?: string }
    >({
      query: (arg) => {
        let api = "";

        const params = { ...arg };
        if (arg.parcelNumber) {
          delete params.owner;
          api = "searchByStateAndCountyAndParcel";
        } else {
          api = "searchByStateAndCountyAndOwner";
        }
        return {
          url: `regrid/${api}`,
          method: "GET",
          params: { ...params },
        };
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

export const { useCalculatePriceQuery, useLazyGetRegridQuery, useSignatureMutation } = propertyApi;
export default propertyApi;
