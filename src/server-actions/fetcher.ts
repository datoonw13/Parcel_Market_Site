"use server";

import { ErrorResponse } from "@/helpers/error-response";
import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";

// https://api.parcelmarket.com
// eslint-disable-next-line no-undef
export const fetcher = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Device-Type": headers().get("user-agent") || "",
      cookie: cookies().toString(),
    },
  });

  const response = (await request.json()) as {
    data: any;
    errors: string[];
    message: string;
    statusCode: number;
  };

  if (!response?.statusCode?.toString()?.startsWith("2")) {
    let errorMessage = "Something went wrong";
    if (response.message) {
      errorMessage = response.message;
    } else if (response.errors.length > 0) {
      errorMessage = response?.errors?.join("; ");
    }
    throw new ErrorResponse(errorMessage, response.statusCode);
  }
  return response.data;
};
