"use server";

import { ResponseModel } from "@/types/common";
import { revalidatePath as revalidate, revalidateTag as revalidateByTag } from "next/cache";
import { fetcher } from "./fetcher";

export const revalidatePath = (path: string) => revalidate(path);
export const revalidateAllPathAction = () => revalidate("/");
export const revalidateTag = (tag: string) => revalidateByTag(tag);

export const subscribeAction = async (email: string): Promise<ResponseModel<null>> => {
  try {
    await fetcher<null>("user/email-subscription", { method: "POST", body: JSON.stringify({ email }) });
    return {
      data: null,
      errorMessage: null,
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: "User not found",
    };
  }
};

export const userFeedbackAction = async (data: {
  email: string;
  name: string;
  comment: string;
  type: "feedback" | "investing";
}): Promise<ResponseModel<null>> => {
  try {
    await fetcher<null>("user/feedback", { method: "POST", body: JSON.stringify({ ...data }) });
    return {
      data: null,
      errorMessage: null,
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: "Error",
    };
  }
};
