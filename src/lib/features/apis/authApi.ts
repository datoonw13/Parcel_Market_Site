import { ISignUp } from "@/types/auth";
import { ResponseType } from "@/types/common";
import baseApi from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation<ResponseType<null>, ISignUp>({
      query: (arg) => ({
        url: "user/register",
        method: "POST",
        body: arg,
      }),
    }),
  }),
});

export const { useRegisterMutation } = authApi;
export default authApi;
