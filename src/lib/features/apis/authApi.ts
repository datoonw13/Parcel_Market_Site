import { ISignIn, ISignInResponse, ISignUp, UserModel } from "@/types/auth";
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
    auth: build.mutation<ResponseType<ISignInResponse>, ISignIn>({
      query: (arg) => ({
        url: "user/auth",
        method: "POST",
        body: arg,
      }),
    }),
    getAuthedUser: build.query<ResponseType<UserModel>, void>({
      query: (arg) => ({
        url: "user/profile",
        method: "GET",
      }),
    }),
  }),
});

export const { useRegisterMutation, useAuthMutation, useLazyGetAuthedUserQuery } = authApi;
export default authApi;
