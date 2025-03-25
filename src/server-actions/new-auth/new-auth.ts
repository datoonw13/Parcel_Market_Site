"use server";

import { ErrorResponse } from "@/helpers/error-response";
import { ISignInResponse } from "@/types/auth";
import { ITokens, ResponseModel, UserSource } from "@/types/common";
import { jwtDecode } from "jwt-decode";
import { cookies, headers } from "next/headers";
import moment from "moment";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { userSignUpValidation } from "@/zod-validations/auth-validations";
import { z } from "zod";
import { fetcher } from "../fetcher";

interface DecodedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isSubscribed: string;
  isGoogleUser: string;
  exp: number;
}

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isSubscribed: string;
  isGoogleUser: string;
  sessionValidUntil: Date;
}

export const setAuthTokensAction = (data: Array<{ token: string; tokenName: string; remember: boolean }>) => {
  data.forEach(({ token, tokenName, remember }) => {
    const decodedToken = jwtDecode(token) as { exp: number };
    const maxAgeInSeconds = moment.duration(moment.unix(decodedToken.exp).diff(moment(new Date()))).asSeconds();
    cookies().set({
      name: tokenName,
      value: token,
      httpOnly: true,
      secure: true,
      ...(remember && { maxAge: maxAgeInSeconds }),
    });
  });
};

export const removeAuthTokensAction = () => {
  const c = cookies();
  if (c.get("jwt")) {
    c.delete("jwt");
  }
  if (c.get("jwt-refresh")) {
    c.delete("jwt-refresh");
  }
};

export const logOutUserAction = async () => {
  const headersList = headers();
  // read the custom x-url header
  const domain = headersList.get("host") || "";
  const fullUrl = headersList.get("referer") || "";

  cookies().delete("jwt");
  cookies().delete("jwt-refresh");
  revalidatePath("/");
  redirect(fullUrl);
};

export const refreshTokenAction = async (): Promise<ResponseModel<string | null>> => {
  try {
    const data = await fetcher<ISignInResponse>("auth/token/refresh", { method: "POST" });
    return {
      data: data.access_token,
      errorMessage: null,
    };
  } catch (error) {
    return {
      errorMessage: (error as ErrorResponse).message,
      data: null,
    };
  }
};

export const getAuthedUserDataAction = async (): Promise<AuthUser | null> => {
  const accessToken = cookies().get("jwt")?.value || null;

  let user: AuthUser | null = null;

  if (accessToken) {
    try {
      const decoded = jwtDecode(accessToken) as DecodedUser;
      const { id, email, firstName, lastName, isSubscribed, isGoogleUser, exp } = decoded;

      user = {
        id,
        email,
        firstName,
        lastName,
        isSubscribed,
        isGoogleUser,
        sessionValidUntil: new Date(exp * 1000),
      };
    } catch (error) {}
  }

  return user;
};

export const isAuthenticatedAction = async (): Promise<{ isAuthed: boolean; expiresIn: null | number }> => {
  const token = cookies().get("jwt-refresh")?.value;
  let expiresIn: number | null = null;

  if (token) {
    expiresIn = jwtDecode(token).exp || null;
  }
  return {
    isAuthed: !!token,
    expiresIn,
  };
};

export const authWithCredentialsAction = async (data: { email: string; password: string }): Promise<ResponseModel<ITokens | null>> => {
  try {
    const request = await fetcher<ITokens>("auth/login", {
      method: "post",
      body: JSON.stringify(data),
    });
    return {
      data: request,
      errorMessage: null,
    };
  } catch (error) {
    return { data: null, errorMessage: (error as ErrorResponse).message };
  }
};

export const authWithSocialNetworkAction = async (data: {
  token: string;
  userSource: UserSource;
}): Promise<ResponseModel<ITokens | null>> => {
  try {
    const request = await fetcher<ITokens>("auth/login/token", {
      method: "POST",
      body: JSON.stringify({ token: data.token, userSource: data.userSource }),
    });
    return { data: request, errorMessage: null };
  } catch (error) {
    return {
      errorMessage: (error as ErrorResponse)?.message || "some",
      data: null,
    };
  }
};

export const signUpUserAction = async (
  values: z.infer<ReturnType<typeof userSignUpValidation>>
): Promise<ResponseModel<ITokens | null>> => {
  try {
    const zohoObject = cookies().get("zoho") ? JSON.parse(cookies().get("zoho")?.value || " ") : null;
    const request = await fetcher<ITokens | null>("auth/register", {
      method: "POST",
      body: JSON.stringify({ ...values, ...(zohoObject && { ...zohoObject }) }),
      cache: "no-cache",
    });

    if (zohoObject) {
      cookies().delete("zoho");
    }

    return {
      data:
        request && request.refresh_token && request.access_token
          ? {
              ...request,
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
