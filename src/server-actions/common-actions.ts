"use server";

import { cookies } from "next/headers";

export const getProtectedData = async <T, >(url: string, options?: any): Promise<T>   => {
  const request = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      cookie: cookies().toString(),
    },
  });
  const data = await request.json();
  return data
};
