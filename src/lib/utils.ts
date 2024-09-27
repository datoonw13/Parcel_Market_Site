import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isElementVisible(parcelNumberNoFormatting: string, parentId: string) {
  const rect = document.getElementById(`${parentId}`)?.getBoundingClientRect();

  const containerRect = document.querySelector("#volt-scroll>div")?.getBoundingClientRect();

  if (!containerRect || !rect) {
    return false;
  }
  return rect.top >= containerRect.top && rect.bottom <= containerRect.bottom;
}
