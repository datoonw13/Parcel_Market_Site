"use server";

import { cookies } from "next/headers";

export const fetcher = async <T>(apiUrl: string, options?: RequestInit): Promise<{data: T | null, error: boolean }> => { // eslint-disable-line

  try {
    const request = await fetch(`https://api.parcelmarket.com/api/${apiUrl}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        cookie: cookies().toString(),
      },
    });
    const data = await request.json();
    return {
      data,
      error: data?.statusCode.toString()[0] !== "2",
    };
  } catch (error) {
    return { error: true, data: null };
  }
};
