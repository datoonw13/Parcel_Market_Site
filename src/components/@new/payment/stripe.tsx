"use client";

import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { useCallback } from "react";
import { getStripeSessionAction } from "@/server-actions/subscription/actions";

const stripePromise = loadStripe(
  "pk_test_51PgJWHK4fDeIIHWZmno0otYwwjWcWtxZO7yK2agdk0YQN2aDssiyrXEyIjsfYRXPd0sq9PpVM5hUWCTBH9mM9XGs00WDDK27VM"
);

const Stripe = () => {
  const fetchClientSecret = useCallback(() => getStripeSessionAction(), []);
  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default Stripe;
