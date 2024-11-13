"use client";

import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { useCallback, useRef, useState } from "react";
import { getStripeSessionAction, revalidateAllPath } from "@/server-actions/subscription/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { SubscriptionType } from "@/types/subscriptions";
import { getAccessToken, updateAccessToken } from "@/server-actions/user/actions";
import routes from "@/helpers/routes";
import LoadingCircle from "@/icons/LoadingCircle";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "");

const delay = () => new Promise((resolve) => setTimeout(resolve, 5000));

const Stripe = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  // const timerRef = useRef<>

  const fetchClientSecret = useCallback(async () => getStripeSessionAction(searchParams.get("plan") as SubscriptionType), [searchParams]);

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          fetchClientSecret,
          onComplete: async () => {
            // setLoading(true);
            // await delay();
            // const data = await getAccessToken();
            // if (data.data) {
            //   updateAccessToken(data.data);
            //   revalidateAllPath();
            //   router.push(routes.home.fullUrl);
            // }
          },
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default Stripe;
