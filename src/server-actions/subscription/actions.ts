"use server";

import { ErrorResponse } from "@/helpers/error-response";
import { IStripeCharge, IStripePaymentMethods, ISubscription, SubscriptionType } from "@/types/subscriptions";
import { ResponseModel } from "@/types/common";
import { revalidatePath } from "next/cache";
import { DeletionAccountReason } from "@/types/auth";
import { fetcher } from "../fetcher";
import { refreshToken } from "../user/actions";

export const getStripeSessionAction = async (subscriptionType: SubscriptionType): Promise<any | null> => {
  try {
    const data = await fetcher<{ clientSecret: string }>(`stripe/create-checkout-session-subscription`, {
      method: "POST",
      body: JSON.stringify({ subscriptionType }),
    });

    return data.clientSecret;
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};

export const getUserSubscriptions = async (): Promise<ResponseModel<ISubscription[] | null>> => {
  try {
    const data = await fetcher<ISubscription[]>(`stripe/subscriptions`, {
      method: "GET",
      cache: "no-store",
    });

    return {
      errorMessage: null,
      data,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};

export const cancelSubscriptionAction = async (
  subscriptionId: string,
  deleteReason: DeletionAccountReason
): Promise<ResponseModel<null>> => {
  try {
    await fetcher<null>(`stripe/subscription`, {
      method: "DELETE",
      body: JSON.stringify({ deleteReason, subscriptionId }),
    });
    await refreshToken();
    return {
      errorMessage: null,
      data: null,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};

export const getUserPaymentMethods = async (): Promise<ResponseModel<IStripePaymentMethods | null>> => {
  try {
    const data = await fetcher<IStripePaymentMethods>(`stripe/paymentMethods`, {
      method: "GET",
      cache: "no-cache",
    });
    return {
      errorMessage: null,
      data,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};

export const getUserBillingHistoryAction = async (): Promise<ResponseModel<IStripeCharge[] | null>> => {
  try {
    const data = await fetcher<{ charges: IStripeCharge[] }>(`stripe/history`, {
      method: "GET",
      cache: "no-store",
    });

    return {
      errorMessage: null,
      data: data.charges,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};

export const revalidateAllPath = () => {
  revalidatePath("/");
};
