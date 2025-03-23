"use server";

import { ErrorResponse } from "@/helpers/error-response";
import { ISignInResponse } from "@/types/auth";
import { ResponseModel } from "@/types/common";
import { jwtDecode } from "jwt-decode";
import { cookies, headers } from "next/headers";
import moment from "moment";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

export const setAuthToken = (token: string, tokenName: string, remember?: boolean) => {
  const decodedToken = jwtDecode(token) as { exp: number };
  const maxAgeInSeconds = moment.duration(moment.unix(decodedToken.exp).diff(moment(new Date()))).asSeconds();
  // set jwt token in cookie
  cookies().set({
    name: tokenName,
    value: token,
    httpOnly: true,
    secure: true,
    ...(remember && { maxAge: maxAgeInSeconds }),
  });
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
    setAuthToken(data.access_token, "jwt");
    return {
      data: null,
      errorMessage: null,
    };
  } catch (error) {
    logOutUserAction();
    return {
      errorMessage: (error as ErrorResponse).message,
      data: null,
    };
  }
};

export const getAuthedUserDataAction = async (): Promise<{ user: AuthUser | null; isAuthed: boolean } | null> => {
  const refreshToken = cookies().get("jwt-refresh")?.value || null;
  if (!refreshToken) {
    return null;
  }

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

  return {
    isAuthed: !!refreshToken,
    user,
  };
};

export const isAuthenticatedAction = async (): Promise<boolean> => {
  const isAuthed = cookies().get("jwt-refresh")?.value;
  return !!isAuthed;
};
