"use server";

import { ErrorResponse } from "@/helpers/error-response";
import { cookies } from "next/headers";

// https://api.parcelmarket.com
// eslint-disable-next-line no-undef
export const fetcher = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const request = await fetch(`https://api.parcelmarket.com/api/${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      cookie: cookies().toString(),
    },
  });

  const response = (await request.json()) as {
    data: any;
    errors: string[];
    message: string;
    statusCode: number;
  };

  console.log(response, 22);

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
