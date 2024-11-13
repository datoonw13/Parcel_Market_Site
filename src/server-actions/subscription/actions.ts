"use server";

import { ErrorResponse } from "@/helpers/error-response";
import { IStripeCharge, IStripePaymentMethods, ISubscription, SubscriptionType } from "@/types/subscriptions";
import { ResponseModel } from "@/types/common";
import { revalidatePath, revalidateTag } from "next/cache";
import { DeletionAccountReason } from "@/types/auth";
import { headers } from "next/headers";
import routes from "@/helpers/routes";
import moment from "moment";
import { fetcher } from "../fetcher";
import { subscriptionTags } from "./tags";

export const getStripeSessionAction = async (subscriptionType: SubscriptionType): Promise<any | null> => {
  try {
    const headersList = headers();
    // read the custom x-url header
    const domain = headersList.get("host") || "";
    const fullUrl = headersList.get("referer") || "";
    const selectedPlan = new URL(fullUrl.toString()).searchParams.get("plan");
    const date = moment().toISOString();
    const url = new URL(fullUrl);

    const data = await fetcher<{ clientSecret: string }>(`stripe/create-checkout-session-subscription`, {
      method: "POST",
      body: JSON.stringify({
        subscriptionType,
        redirectUri: `${url.origin}${url.pathname}?&success=true&date=${date}&selectedType=${selectedPlan}&plan=${selectedPlan}`,
        // redirectUri: `${fullUrl.split("://")[0]}://${domain}${routes.home.fullUrl}`,
      }),
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
      next: {
        tags: [subscriptionTags.subscription],
      },
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
    revalidateTag(subscriptionTags.subscription);
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

export const resumeSubscriptionAction = async (subscriptionId: string): Promise<ResponseModel<null>> => {
  try {
    await fetcher<null>(`stripe/subscription/resume`, {
      method: "POST",
      body: JSON.stringify({ subscriptionId }),
    });
    revalidateTag(subscriptionTags.subscription);
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
      next: {
        tags: [subscriptionTags.paymentMethods],
      },
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

export const addPaymentMethodAction = async (paymentMethodId: string): Promise<ResponseModel<IStripeCharge[] | null>> => {
  try {
    await fetcher<{ charges: IStripeCharge[] }>(`stripe/paymentMethod`, {
      method: "PUT",
      body: JSON.stringify({ paymentMethodId }),
    });
    revalidateTag(subscriptionTags.paymentMethods);
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

export const removePaymentMethodsAction = async (paymentMethodIds: string[]): Promise<ResponseModel<IStripeCharge[] | null>> => {
  try {
    await fetcher<{ charges: IStripeCharge[] }>(`stripe/paymentMethod`, {
      method: "DELETE",
      body: JSON.stringify({ paymentMethodIds }),
    });
    revalidateTag(subscriptionTags.paymentMethods);
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

// Put: api/stripe/subscription
// 10:54
// export class UpdateSubscriptionDto {
//   @IsNotEmpty()
//   @IsEnum(SubscriptionType)
//   subscriptionType: SubscriptionType;

//   @IsString()
//   @IsNotEmpty()
//   paymentMethodId: string;
// }
export const updateSubscriptionAction = async (
  subscriptionType: SubscriptionType,
  paymentMethodId: string
): Promise<ResponseModel<IStripeCharge[] | null>> => {
  try {
    await fetcher<{ charges: IStripeCharge[] }>(`stripe/subscription`, {
      method: "PUT",
      body: JSON.stringify({ paymentMethodId, subscriptionType }),
    });
    // revalidatePath("/", "layout");
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

export const revalidateAllPath = () => {
  revalidatePath("/");
};
