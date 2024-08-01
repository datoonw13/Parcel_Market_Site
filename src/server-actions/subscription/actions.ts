import { ErrorResponse } from "@/helpers/error-response";
import { ISubscription, SubscriptionType } from "@/types/subcriptions";
import { ResponseModel } from "@/types/common";
import { fetcher } from "../fetcher";

export const getStripeSessionAction = async (subscriptionType: SubscriptionType): Promise<any | null> => {
  try {
    const data = await fetcher<{ clientSecret: string }>(`stripe/create-checkout-session-subscription`, {
      method: "POST",
      body: JSON.stringify({ subscriptionType }),
    });

    return {
      errorMessage: null,
      data: data.clientSecret,
    };
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
    const data = await fetcher<{ data: ISubscription[] }>(`stripe/subscriptions`, {
      method: "GET",
    });
    return {
      errorMessage: null,
      data: data.data,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};
