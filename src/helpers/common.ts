import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const numFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const numericInput = (number: string) => {
  // You can modify the {0,2} to match your decimal preference {min, max}
  const regex = new RegExp(/^\d*(\.)?(\d{0,2})?$/);
  const isValid = regex.test(number);
  let result = null;
  if (isValid && number.startsWith(".")) {
    result = `0${number}`;
  } else {
    result = number;
  }
  return {
    valid: regex.test(number),
    result,
  };
};

export const maskEmail = (email: string) =>
  `${email.split("@")[0][0]}****${email.split("@")[0][email.split("@")[0].length - 1]}@${email.split("@")[1]}`;

export const cn = (...classes: ClassValue[]) => twMerge(clsx(...classes));
