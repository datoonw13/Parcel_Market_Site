"use server";

import { userSignInValidation } from "@/zod-validations/auth-validations";
import { ResponseModel, ResponseType } from "@/types/common";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import routes from "@/helpers/routes";
import { revalidatePath } from "next/cache";
import { ErrorResponse } from "@/helpers/error-response";
import { DeletionAccountReason, ISignInResponse, IUser, IUserSignUp } from "../../types/auth";
import { fetcher } from "../fetcher";

export const setAuthToken = (token: string) => {
  const decodedToken = jwtDecode(token) as { exp: number };
  const maxAgeInSeconds = moment.duration(moment.unix(decodedToken.exp).diff(moment(new Date()))).asSeconds();
  // set jwt token in cookie
  cookies().set({
    name: "jwt",
    value: token,
    httpOnly: true,
    secure: true,
    maxAge: maxAgeInSeconds,
  });
  revalidatePath("/");
};

export const signInUserAction = async (prevState: any, formData: FormData): Promise<ResponseModel<null>> => {
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
    setAuthToken(data.access_token);
  } catch (error) {
    return {
      errorMessage: (error as ErrorResponse).message,
      data: null,
    };
  }

  return {
    errorMessage: null,
    data: null,
  };
};

export const signUpUserAction = async (values: IUserSignUp): Promise<ResponseModel<null>> => {
  try {
    const request = await fetcher<null>("user/register", {
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
  cookies().delete("jwt");
  redirect("?logout=true");
};

export const getUserAction = async (): Promise<ISignInResponse["payload"] | null> => {
  const userString = cookies().get("jwt")?.value;
  if (userString) {
    try {
      const { id, sub, firstName, lastName, email, role } = jwtDecode(userString!) as ISignInResponse["payload"];
      const user = { id, sub, firstName, lastName, email, role };
      return { ...user };
    } catch (error) {
      return null;
    }
  }
  return null;
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
    await logOutUserAction();
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

export const sendEmailResetCodeAction = async (values: { password: string }): Promise<ResponseModel<null>> => {
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
    setAuthToken(request.access_token);
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