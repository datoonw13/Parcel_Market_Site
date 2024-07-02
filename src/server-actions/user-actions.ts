"use server";

import { userSignInValidation } from "@/zod-validations/auth-validations";
import { ResponseType } from "@/types/common";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import routes from "@/helpers/routes";
import { ISignInResponse, IUserSignUp } from "../types/auth";
import { fetcher } from "./fetcher";

export const signInUser = async (prevState: any, formData: FormData) => {
  const values = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validations = userSignInValidation.safeParse(values);
  if (!validations.success) {
    return {
      error: true,
      message: "Wrong email or password",
    };
  }
  const { error, data } = await fetcher<ResponseType<ISignInResponse>>("user/auth", {
    method: "POST",
    body: JSON.stringify(validations.data),
    cache: "no-cache",
  });

  if (error) {
    return {
      error: true,
      message: "Wrong email or password",
    };
  }

  const decodedToken = jwtDecode(data?.data.access_token!) as { exp: number };
  const maxAgeInSeconds = moment.duration(moment.unix(decodedToken.exp).diff(moment(new Date()))).asSeconds();
  // set jwt token in cookie
  cookies().set({
    name: "jwt",
    value: data?.data.access_token!,
    httpOnly: true,
    secure: true,
    maxAge: maxAgeInSeconds,
  });
  redirect(routes.home.url);
  return null;
};

export const signUpUserAction = async (values: IUserSignUp) => {
  const request = await fetcher<ResponseType<any>>("user/register", {
    method: "POST",
    body: JSON.stringify(values),
    cache: "no-cache",
  });
  if (request.error) {
    return {
      error: true,
      message: request.data?.message === "Conflict" ? "Email already registered" : "Registration failed",
    };
  }

  return {
    error: false,
    message: request.data?.message,
  };
};

export const getUserAction = async (): Promise<ISignInResponse["payload"] | null> => {
  const userString = cookies().get("jwt")?.value;
  if (userString) {
    try {
      const { id, sub, firstName, lastName, email, role } = jwtDecode(userString!) as ISignInResponse["payload"];
      return { id, sub, firstName, lastName, email, role };
    } catch (error) {
      return null;
    }
  }
  return null;
};

export const activateUserAccountAction = async (token?: string): Promise<{ error: boolean }> => {
  if (!token) {
    redirect(`/${routes.home.url}`);
    return { error: true };
  }
  const request = await fetcher(`user/activate/${token}`, { method: "POST" });
  return { error: request.error };
};

export const logOutUserAction = async () => {
  cookies().delete("jwt");
  redirect("?logout=true");
};
