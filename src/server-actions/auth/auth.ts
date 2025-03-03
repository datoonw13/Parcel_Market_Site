"use server";

import { defaultSignInSchema, userSignUpValidation } from "@/zod-validations/auth-validations";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { ISignInResponse, IUserBaseInfo } from "@/types/auth";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import { cookies } from "next/headers";
import { ITokens, ResponseModel, UserSource } from "@/types/common";
import { ErrorResponse } from "@/helpers/error-response";
import { fetcher } from "../fetcher";

const setAuthTokens = (refreshToken: string, accessToken: string, remember?: boolean) => {
  const decodedToken = jwtDecode(refreshToken) as { exp: number };
  const maxAgeInSeconds = moment.duration(moment.unix(decodedToken.exp).diff(moment(new Date()))).asSeconds();
  cookies().set({
    name: "jwt-refresh",
    value: refreshToken,
    httpOnly: true,
    secure: true,
    ...(remember && { maxAge: maxAgeInSeconds }),
  });
  cookies().set({
    name: "jwt",
    value: accessToken,
    httpOnly: true,
    secure: true,
  });
  revalidatePath("/");
};

const defaultSignInAction = async (
  values: z.infer<typeof defaultSignInSchema>,
  remember: boolean
): Promise<ResponseModel<(ITokens & { decodedAccessToken: IUserBaseInfo }) | null>> => {
  try {
    const request = await fetcher<ITokens>("auth/login", {
      method: "POST",
      body: JSON.stringify(values),
    });
    setAuthTokens(request.refresh_token, request.access_token, remember);
    return {
      data: {
        ...request,
        decodedAccessToken: jwtDecode(request.access_token),
      },
      errorMessage: null,
    };
  } catch (error) {
    return { data: null, errorMessage: (error as ErrorResponse).message };
  }
};

const thirdPartyAuthAction = async (
  token: string,
  userSource: UserSource
): Promise<ResponseModel<(ITokens & { decodedAccessToken: IUserBaseInfo }) | null>> => {
  try {
    const request = await fetcher<ITokens>("auth/login/token", {
      method: "POST",
      body: JSON.stringify({ token, userSource }),
    });
    setAuthTokens(request.refresh_token, request.access_token);
    return { data: { ...request, decodedAccessToken: jwtDecode(request.access_token) }, errorMessage: null };
  } catch (error) {
    return {
      errorMessage: (error as ErrorResponse)?.message || "some",
      data: null,
    };
  }
};

const signUpUserAction = async (
  values: z.infer<ReturnType<typeof userSignUpValidation>>
): Promise<ResponseModel<(ITokens & { decodedAccessToken: IUserBaseInfo | null }) | null>> => {
  try {
    const request = await fetcher<ITokens | null>("auth/register", {
      method: "POST",
      body: JSON.stringify(values),
      cache: "no-cache",
    });

    if (request) {
      setAuthTokens(request.refresh_token, request.access_token);
    }
    return {
      data: request
        ? {
            ...request,
            decodedAccessToken: jwtDecode(request!.access_token),
          }
        : null,
      errorMessage: null,
    };
  } catch (error) {
    return {
      errorMessage: (error as ErrorResponse).statusCode === 409 ? "Email already registered" : "Registration failed",
      data: null,
    };
  }
};

export { defaultSignInAction, thirdPartyAuthAction, signUpUserAction };
