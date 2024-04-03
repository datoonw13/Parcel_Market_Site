import { ISignIn, ISignInResponse, ISignUp } from "@/types/auth";
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
    auth: build.mutation<ISignInResponse, ISignIn>({
      query: (arg) => ({
        url: "user/auth",
        method: "POST",
        body: arg,
      }),
    }),
  }),
});

export const { useRegisterMutation, useAuthMutation } = authApi;
export default authApi;
