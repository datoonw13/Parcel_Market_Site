"use client";

import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { useCallback } from "react";
import { getStripeSessionAction, revalidateAllPath } from "@/server-actions/subscription/actions";
import { useSearchParams } from "next/navigation";
import { SubscriptionType } from "@/types/subscriptions";

const stripePromise = loadStripe(
  "pk_test_51PgJWHK4fDeIIHWZmno0otYwwjWcWtxZO7yK2agdk0YQN2aDssiyrXEyIjsfYRXPd0sq9PpVM5hUWCTBH9mM9XGs00WDDK27VM"
);

const Stripe = () => {
  const searchParams = useSearchParams();

  const fetchClientSecret = useCallback(async () => getStripeSessionAction(searchParams.get("plan") as SubscriptionType), [searchParams]);

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          fetchClientSecret,
          onComplete: () => {
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
