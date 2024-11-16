"use server";

import { updateUserInfoSchema, userSignInValidation } from "@/zod-validations/auth-validations";
import { ResponseModel, ResponseType } from "@/types/common";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import routes from "@/helpers/routes";
import { revalidatePath } from "next/cache";
import { ErrorResponse } from "@/helpers/error-response";
import { z } from "zod";
import { NextRequest } from "next/server";
import { DeletionAccountReason, IDecodedAccessToken, ISignInResponse, IUser, IUserSignUp } from "../../types/auth";
import { fetcher } from "../fetcher";

// export const setAuthToken = (token: string, remember?: boolean) => {
//   const decodedToken = jwtDecode(token) as { exp: number };
//   const maxAgeInSeconds = moment.duration(moment.unix(decodedToken.exp).diff(moment(new Date()))).asSeconds();
//   // set jwt token in cookie
//   cookies().set({
//     name: "jwt",
//     value: token,
//     httpOnly: true,
//     secure: true,
//     ...(remember && { maxAge: maxAgeInSeconds }),
//   });
//   revalidatePath("/");
// };

export const updateAccessToken = (token: string) => {
  cookies().set({
    name: "jwt",
    value: token,
    httpOnly: true,
    secure: true,
  });
};

export const getAccessToken = async (): Promise<ResponseModel<string | null>> => {
  try {
    const data = await fetcher<ISignInResponse>("user/token/refresh", {
      method: "POST",
      cache: "no-cache",
    });
    return {
      data: data.access_token,
      errorMessage: null,
    };
  } catch (error) {
    return {
      errorMessage: JSON.stringify("error"),
      data: null,
    };
  }
};

export const signInUserAction = async (
  prevState: any,
  formData: FormData,
  remember?: boolean
): Promise<ResponseModel<ISignInResponse | null>> => {
  const values = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const validations = userSignInValidation.safeParse(values);
  if (!validations.success) {
    return {
      errorMessage: "Unauthorized",
      data: null,
    };
  }

  try {
    const data = await fetcher<ISignInResponse>("user/auth", {
      method: "POST",
      body: JSON.stringify(validations.data),
      cache: "no-cache",
    });
    // set jwt tokens in cookie
    const decodedToken = jwtDecode(data.refresh_token) as { exp: number };
    const maxAgeInSeconds = moment.duration(moment.unix(decodedToken.exp).diff(moment(new Date()))).asSeconds();
    cookies().set({
      name: "jwt-refresh",
      value: data.refresh_token,
      httpOnly: true,
      secure: true,
      ...(remember && { maxAge: maxAgeInSeconds }),
    });
    cookies().set({
      name: "jwt",
      value: data.access_token,
      httpOnly: true,
      secure: true,
    });
    return { data, errorMessage: null };
  } catch (error) {
    return {
      errorMessage: (error as ErrorResponse).message,
      data: null,
    };
  }
};

export const googleSignInUserAction = async (token: string): Promise<ResponseModel<ISignInResponse | null>> => {
  try {
    const data = await fetcher<ISignInResponse>("user/auth/google", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
    const decodedToken = jwtDecode(data.refresh_token) as { exp: number };
    const maxAgeInSeconds = moment.duration(moment.unix(decodedToken.exp).diff(moment(new Date()))).asSeconds();
    cookies().set({
      name: "jwt-refresh",
      value: data.refresh_token,
      httpOnly: true,
      secure: true,
    });
    cookies().set({
      name: "jwt",
      value: data.access_token,
      httpOnly: true,
      secure: true,
    });
    return { data, errorMessage: null };
  } catch (error) {
    return {
      errorMessage: (error as ErrorResponse)?.message || "some",
      data: null,
    };
  }
};

export const googleSignUpUserAction = async (payload: IUserSignUp, token: string): Promise<ResponseModel<ISignInResponse | null>> => {
  try {
    const data = await fetcher<ISignInResponse>("user/register", {
      method: "POST",
      body: JSON.stringify({ token, ...payload }),
    });
    const decodedToken = jwtDecode(data.refresh_token) as { exp: number };
    const maxAgeInSeconds = moment.duration(moment.unix(decodedToken.exp).diff(moment(new Date()))).asSeconds();
    cookies().set({
      name: "jwt-refresh",
      value: data.refresh_token,
      httpOnly: true,
      secure: true,
    });
    cookies().set({
      name: "jwt",
      value: data.access_token,
      httpOnly: true,
      secure: true,
    });
    return { data, errorMessage: null };
  } catch (error) {
    return {
      errorMessage: (error as ErrorResponse)?.message || "some",
      data: null,
    };
  }
};

export const signUpUserAction = async (values: IUserSignUp): Promise<ResponseModel<null>> => {
  try {
    await fetcher<null>("user/register", {
      method: "POST",
      body: JSON.stringify(values),
      cache: "no-cache",
    });
    return {
      data: null,
      errorMessage: null,
    };
  } catch (error) {
    return {
      errorMessage: (error as ErrorResponse).statusCode === 409 ? "Email already registered" : "Registration failed",
      data: null,
    };
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

export const getUserAction = async (): Promise<IDecodedAccessToken | null> => {
  const userString = cookies().get("jwt")?.value;
  if (userString) {
    try {
      const { id, sub, firstName, lastName, email, role, planSelected, isSubscribed, isGoogleUser, exp } = jwtDecode(
        userString!
      ) as IDecodedAccessToken & { exp: number };
      const user = {
        id,
        sub,
        firstName,
        lastName,
        email,
        role,
        planSelected,
        isSubscribed,
        isGoogleUser,
        sessionUntil: moment.unix(exp).toDate(),
      };
      return { ...user };
    } catch (error) {
      return null;
    }
  }
  return null;
};

export const getUserToken = async (): Promise<string | null> => {
  const jwt = cookies().get("jwt")?.value;
  return jwt || null;
};

export const getUserFullDetailsAction = async (): Promise<ResponseModel<IUser | null>> => {
  try {
    const user = await fetcher<IUser>("user/profile", { cache: "no-cache" });
    return {
      data: user,
      errorMessage: null,
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: "User not found",
    };
  }
};

export const getUserChatInfo = async (
  id: number
): Promise<ResponseModel<{ id: number; firstName: string; lastName: string; email: string } | null>> => {
  try {
    const user = await fetcher<{ id: number; firstName: string; lastName: string; email: string }>(`user/info/${id}`, {
      cache: "no-cache",
    });
    return {
      data: user,
      errorMessage: null,
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: "User not found",
    };
  }
};

export const activateUserAccountAction = async (token?: string): Promise<ResponseModel<null>> => {
  if (!token) {
    redirect(`/${routes.home.url}`);
  }
  try {
    await fetcher(`user/activate/${token}`, { method: "POST" });
    return {
      data: null,
      errorMessage: null,
    };
  } catch (error) {
    return {
      errorMessage: "Account activation failed",
      data: null,
    };
  }
};

export const sendPasswordResetCodeAction = async (values: { oldPassword: string; newPassword: string }): Promise<ResponseModel<null>> => {
  try {
    const requset = await fetcher<ResponseType<null>>("user/reset/password/send-email-code", {
      method: "POST",
      body: JSON.stringify(values),
      cache: "no-store",
    });
    return {
      data: null,
      errorMessage: null,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    let errorMessage: ResponseModel<null>["errorMessage"] = null;
    if (errorData.message.includes("You have to wait")) {
      errorMessage = null;
    }
    if (errorData.statusCode === 401) {
      errorMessage = "Current password is incorrect";
    }
    if (errorData.statusCode === 400) {
      errorMessage = "New password validation failed";
    }
    return {
      errorMessage,
      data: null,
    };
  }
};

export const setNewPasswordAction = async (values: { code: string; newPassword: string }): Promise<ResponseModel<null>> => {
  try {
    const request = await fetcher<ResponseType<null>>("user/reset/password", {
      method: "POST",
      body: JSON.stringify(values),
      cache: "no-store",
    });
    return {
      data: null,
      errorMessage: null,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      data: null,
      errorMessage: errorData.message,
    };
  }
};

export const removeUserAccountAction = async (values: {
  password: string;
  deletionResult: DeletionAccountReason;
}): Promise<ResponseModel<null>> => {
  try {
    await fetcher<ResponseType<null>>("user/profile", {
      method: "DELETE",
      body: JSON.stringify(values),
      cache: "no-store",
    });
    return {
      data: null,
      errorMessage: null,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      data: null,
      errorMessage: errorData.message,
    };
  }
};

export const sendEmailResetCodeAction = async (values: { password: string; newEmail: string }): Promise<ResponseModel<null>> => {
  try {
    await fetcher<ResponseType<null>>("user/reset/email/send-email-code", {
      method: "POST",
      body: JSON.stringify(values),
      cache: "no-store",
    });
    return {
      errorMessage: null,
      data: null,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    let errorMessage: ResponseModel<null>["errorMessage"] = null;

    if (errorData.message.includes("You have to wait")) {
      errorMessage = null;
    }
    if (errorData.statusCode === 401) {
      errorMessage = "Current password is incorrect";
    }
    if (errorData.statusCode === 400) {
      errorMessage = errorData.message;
    }
    return {
      errorMessage,
      data: null,
    };
  }
};

export const setNewEmailAction = async (values: { code: string; email: string }): Promise<ResponseModel<null>> => {
  try {
    const request = await fetcher<ISignInResponse>("user/reset/email", {
      method: "POST",
      body: JSON.stringify(values),
      cache: "no-store",
    });
    const newToken = await getAccessToken();
    if (newToken.data) {
      cookies().set({
        name: "jwt",
        value: newToken.data,
        httpOnly: true,
        secure: true,
      });
      revalidatePath("/");
    }

    return {
      data: null,
      errorMessage: null,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};

export const resendSignUpVerificationCodeAction = async (email: string): Promise<ResponseModel<null>> => {
  try {
    await fetcher<ISignInResponse>("user/activate/resend/emal", {
      method: "POST",
      body: JSON.stringify({ email }),
      cache: "no-store",
    });
    return {
      data: null,
      errorMessage: null,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};

export const updateUserInfoAction = async (values: z.infer<typeof updateUserInfoSchema>): Promise<ResponseModel<null>> => {
  try {
    const request = await fetcher<ISignInResponse>("user/profile", {
      method: "PATCH",
      body: JSON.stringify(values),
      cache: "no-store",
    });
    const newToken = await getAccessToken();
    if (newToken.data) {
      cookies().set({
        name: "jwt",
        value: newToken.data,
        httpOnly: true,
        secure: true,
      });
      revalidatePath("/");
    }
    return {
      data: null,
      errorMessage: null,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      data: null,
      errorMessage: errorData.message,
    };
  }
};

export const sendResetPasswordVerificationCodeAction = async (email: string): Promise<ResponseModel<null>> => {
  try {
    await fetcher<null>("user/forgot-password/send-email-code", {
      method: "POST",
      body: JSON.stringify({ email }),
      cache: "no-cache",
    });
    return {
      data: null,
      errorMessage: null,
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: (error as ErrorResponse)?.message,
    };
  }
};

export const setResetPasswordNewPasswordAction = async (data: {
  newPassword: string;
  code: string;
  email: string;
}): Promise<ResponseModel<null>> => {
  try {
    await fetcher<null>("user/forgot-password/reset", {
      method: "POST",
      body: JSON.stringify({ ...data }),
      cache: "no-cache",
    });
    return {
      data: null,
      errorMessage: null,
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: (error as ErrorResponse).message,
    };
  }
};
