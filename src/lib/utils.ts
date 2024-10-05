import { clsx, ClassValue } from "clsx";
import { ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isElementVisible(elementId: string, scrollId: string) {
  const rect = document.getElementById(elementId)?.getBoundingClientRect();

  const containerRect = document.querySelector(`#${scrollId}>div`)?.getBoundingClientRect();

  if (!containerRect || !rect) {
    return false;
  }
  return rect.top >= containerRect.top && rect.bottom <= containerRect.bottom;
}

export const parseSearchParams = <T extends z.ZodTypeAny>(schema: T, searchParams: ReadonlyURLSearchParams) => {
  try {
    const params = new URLSearchParams(searchParams.toString());
    const searchParamsObj: Record<string, string> = {};
    params.keys().forEach((key) => {
      if (key && params.get(key)) {
        searchParamsObj[key] = params.get(key)!;
      }
    });
    return schema.parse(searchParamsObj) as z.infer<T>;
  } catch (error) {
    return null;
  }
};
