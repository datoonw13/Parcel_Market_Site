import { ISignUp } from "@/types/auth";
import baseApi from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation<void, ISignUp>({
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
