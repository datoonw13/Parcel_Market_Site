"use server";

import { ISignInResponse } from "@/types/auth";
import { UserSignInValidation } from "@/zod-validations/auth-validations";
import { ResponseType } from "@/types/common";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import { redirect } from "next/navigation";
import { fetcher } from "./common-actions";

export const signInUser = async (prevState: any, formData: FormData) => {
  const values = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validations = UserSignInValidation.safeParse(values);
  if (!validations.success) {
    return {
      error: true,
      message: "Please provide all required fields",
    };
  }

  const { error, data } = await fetcher<ResponseType<ISignInResponse>>("user/auth", {
    method: "POST",
    body: JSON.stringify(validations.data),
  });

  if (error) {
    return {
      error: true,
      message: data?.message || "Something went wrong...",
    };
  }

  const decodedToken = jwtDecode(data?.data.access_token!) as { exp: number };
  const maxAgeInSeconds = moment.duration(moment.unix(decodedToken.exp).diff(moment(new Date()))).asSeconds();
  cookies().set({
    name: "jwt",
    value: data?.data.access_token!,
    httpOnly: true,
    secure: true,
    maxAge: maxAgeInSeconds,
  });
  redirect("/");
  return null;
};
