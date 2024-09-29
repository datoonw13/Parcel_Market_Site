import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
