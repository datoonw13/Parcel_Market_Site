import {
  GoogleAuthNotRegisteredResponse,
  IRegisterGoogleUser,
  ISignIn,
  ISignInResponse,
  ISignUp,
  ISignUpResponse,
  UserModel,
} from "@/types/auth";
import { ResponseType } from "@/types/common";
import baseApi from "./baseApi";
import { setAuthedUser } from "../slices/authedUserSlice";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation<ResponseType<ISignUpResponse>, ISignUp>({
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
    googleAuth: build.mutation<ResponseType<GoogleAuthNotRegisteredResponse | ISignInResponse>, string>({
      query: (token) => ({
        url: "auth/google",
        method: "GET",
        params: {
          token,
        },
      }),
    }),
    registerGoogleUser: build.mutation<ResponseType<ISignUpResponse>, IRegisterGoogleUser>({
      query: (args) => ({
        url: "auth/google",
        method: "POST",
        body: args,
      }),
    }),
    getAuthedUser: build.query<ResponseType<UserModel>, void>({
      query: (arg) => ({
        url: "user/profile",
        method: "GET",
      }),
    }),
    updateProfile: build.mutation<ResponseType<{ image: string }>, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("image", file);
        return {
          url: "user/profile",
          method: "PUT",
          body: formData,
        };
      },
      async onQueryStarted(file, { dispatch, queryFulfilled, getState }) {
        try {
          const res = await queryFulfilled;
          dispatch(
            authApi.util.updateQueryData("getAuthedUser", undefined, (draft) => {
              draft.data.image = res.data.data.image;
              dispatch(setAuthedUser({ ...draft.data }));
            })
          );
        } catch {}
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useAuthMutation,
  useLazyGetAuthedUserQuery,
  useUpdateProfileMutation,
  useGoogleAuthMutation,
  useRegisterGoogleUserMutation,
} = authApi;
export default authApi;
