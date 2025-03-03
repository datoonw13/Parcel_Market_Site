"use server";

import { defaultSignInSchema } from "@/zod-validations/auth-validations";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { ISignInResponse, IUserBaseInfo } from "@/types/auth";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import { cookies } from "next/headers";
import { ResponseModel } from "@/types/common";
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
): Promise<ResponseModel<(ISignInResponse & { decodedAccessToken: IUserBaseInfo }) | null>> => {
  try {
    const request = await fetcher<ISignInResponse>("auth/login", {
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

export const googleSignInAction = async (
  token: string,
  remember: boolean
): Promise<ResponseModel<(ISignInResponse & { decodedAccessToken: IUserBaseInfo }) | null>> => {
  try {
    const request = await fetcher<ISignInResponse>("user/auth/google", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
    setAuthTokens(request.access_token, request.refresh_token, remember);
    return { data: { ...request, decodedAccessToken: jwtDecode(request.access_token) }, errorMessage: null };
  } catch (error) {
    return {
      errorMessage: (error as ErrorResponse)?.message || "some",
      data: null,
    };
  }
};

export { defaultSignInAction };
