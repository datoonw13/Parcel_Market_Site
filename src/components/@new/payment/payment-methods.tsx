"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IStripePaymentMethods, ISubscription, SubscriptionType } from "@/types/subscriptions";
import { getUserSubscriptions, revalidateAllPath, updateSubscriptionAction } from "@/server-actions/subscription/actions";
import routes from "@/helpers/routes";
import useNotification from "@/hooks/useNotification";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { generateAccessToken, updateAccessToken } from "@/server-actions/user/actions";
import LoadingCircle from "@/icons/LoadingCircle";
import moment from "moment";
import RadioButton from "../shared/forms/RadioButton";
import Stripe from "./stripe/stripe";
import Button from "../shared/forms/Button";
import CardIcon from "../user/payment-details/card-icon";

const getPlanDetails = (plan: SubscriptionType) => {
  switch (plan) {
    case SubscriptionType.Monthly:
      return {
        label: "Monthly",
        price: "$20.00 USD",
      };
    case SubscriptionType.Annual:
      return {
        label: "Annual",
        price: "$215.00 USD",
      };
    default:
      return {
        label: "Trial",
        price: "$0.00 USD",
      };
  }
};

const PaymentMethods = ({
  userPaymentMethods,
  userSubscriptions,
}: {
  userPaymentMethods?: IStripePaymentMethods | null;
  userSubscriptions: ISubscription[] | null;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams.toString());
  const [paymentMethod, setPaymentMethod] = useState<string | null>("stripe");
  const hasUserActiveSubscription = userSubscriptions?.find((el) => el.status === "active");
  const { notify } = useNotification();
  const [updatePending, setUpdatePending] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const showLoader =
    searchParams.get("selectedType") &&
    searchParams.get("success") === "true" &&
    searchParams.get("date") &&
    moment.duration(moment(new Date()).diff(searchParams.get("date"))).as("minutes") <= 3;

  const handleUpdate = async () => {
    if (paymentMethod && params.get("plan")) {
      setUpdatePending(true);
      const { errorMessage } = await updateSubscriptionAction(params.get("plan") as SubscriptionType, paymentMethod);
      setUpdatePending(false);
      if (!errorMessage) {
        router.push(`${routes.user.subscription.fullUrl}?success=true`);
      } else {
        const data = await generateAccessToken();
        if (data.data) {
          updateAccessToken(data.data);
        }
        notify({ title: "Subscription Update", description: errorMessage }, { variant: "error" });
      }
    }
  };

  const handleSubscriptionChange = async () => {
    intervalRef.current = setInterval(async () => {
      const data = await getUserSubscriptions();
      let isUpdated = false;
      if (searchParams.get("selectedType") === "Trial") {
        isUpdated = !!data.data?.find((el) => el.status === "trialing");
      } else {
        isUpdated = !!data.data?.find((el) => el.type === searchParams.get("selectedType"));
      }
      console.log(data.data, 22);

      if (isUpdated) {
        const token = await generateAccessToken();
        console.log(token, 111);

        if (token.data) {
          updateAccessToken(token.data);
          revalidateAllPath();
          router.replace(routes.home.fullUrl);
        }
        window.clearInterval(intervalRef.current);
      }
    }, 5000);
  };

  useEffect(() => {
    if (hasUserActiveSubscription && userPaymentMethods && userPaymentMethods?.length > 0) {
      const cardId = userPaymentMethods?.find((el) => el.isDefault)?.id;
      setPaymentMethod(cardId || userPaymentMethods![0].id);
    }
  }, [hasUserActiveSubscription, userPaymentMethods]);

  useEffect(() => {
    if (showLoader) {
      handleSubscriptionChange();
    } else {
      window.clearInterval(intervalRef.current);
    }

    return () => {
      window.clearInterval(intervalRef.current);
    };
  }, [showLoader]);

  useEffect(() => {
    if ((searchParams.get("success") || searchParams.get("date")) && !showLoader) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("success");
      newSearchParams.delete("date");
      newSearchParams.delete("selectedPlan");
      router.replace(`${pathname}?${newSearchParams.toString()}`);
    }
  }, [pathname, router, searchParams, showLoader]);

  return (
    <div className="relative border border-grey-100 rounded-2xl w-full bg-white">
      {showLoader && (
        <div className="absolute z-50 bg-white/60 blur-sm flex items-center w-full h-full top-0 left-0">
          <LoadingCircle />
        </div>
      )}
      <h1 className="px-6 pt-6 pb-4 border-b border-b-grey-100 md:text-lg font-medium md:font-semibold">Payment Method</h1>
      <div className="space-y-8 px-6 py-4 pb-6">
        <div className="">
          <div className="space-y-4 md:Space-y-6">
            {hasUserActiveSubscription && (
              <RadioGroup onValueChange={(value) => setPaymentMethod(value)}>
                {userPaymentMethods?.map((el) => (
                  <RadioGroupItem
                    key={el.id}
                    value={el.id}
                    label={
                      <div className="flex items-center gap-3 md:gap-4">
                        <p>
                          {"**** "}
                          {el.last4} ({el.brand})
                        </p>
                      </div>
                    }
                    checked={paymentMethod === el.id}
                  />
                ))}
              </RadioGroup>
            )}
            {!hasUserActiveSubscription && (
              <RadioButton
                name="stripe"
                onChange={() => setPaymentMethod("stripe")}
                labelClassName="font-normal"
                label={
                  <div className="flex items-center gap-3 md:gap-4">
                    <p>Credit/Debit Card</p>
                    <div className="flex items-center gap-4">
                      <CardIcon card="visa" />
                      <CardIcon card="mastercard" />
                      <CardIcon card="amex" />
                    </div>
                  </div>
                }
                checked={paymentMethod === "stripe"}
              />
            )}
            {/* <RadioButton
              name="paypal"
              onChange={() => setPaymentMethod("paypal")}
              labelClassName="font-normal"
              label={
                <div className="relative w-20 h-6">
                  <Image src="/paypal.png" fill className="w-full h-full absolute" alt="" />
                </div>
              }
              checked={paymentMethod === "paypal"}
            /> */}
          </div>
        </div>
        {paymentMethod === "stripe" ? (
          <Stripe key={searchParams.toString()} />
        ) : (
          <div className="w-full">
            <Button onClick={handleUpdate} loading={updatePending} className="w-full">
              Pay {getPlanDetails(params.get("plan") as SubscriptionType).price}
            </Button>
          </div>
        )}
        {/* {paymentMethod === "paypal" && <Paypal />} */}
      </div>
    </div>
  );
};

export default PaymentMethods;
