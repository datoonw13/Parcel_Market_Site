"use client";

import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { useCallback } from "react";
import { getStripeSessionAction, revalidateAllPath } from "@/server-actions/subscription/actions";
import { useSearchParams } from "next/navigation";
import { SubscriptionType } from "@/types/subscriptions";
import { getAccessToken, updateAccessToken } from "@/server-actions/user/actions";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "");

const Stripe = () => {
  const searchParams = useSearchParams();

  const fetchClientSecret = useCallback(async () => getStripeSessionAction(searchParams.get("plan") as SubscriptionType), [searchParams]);

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          fetchClientSecret,
          onComplete: async () => {
            const data = await getAccessToken();
            if (data.data) {
              updateAccessToken(data.data);
            }
            revalidateAllPath();
          },
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default Stripe;
