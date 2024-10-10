"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IStripePaymentMethods, ISubscription, SubscriptionType } from "@/types/subscriptions";
import { updateSubscriptionAction } from "@/server-actions/subscription/actions";
import routes from "@/helpers/routes";
import useNotification from "@/hooks/useNotification";
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
        label: "Yearly",
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
  const params = new URLSearchParams(searchParams.toString());
  const [paymentMethod, setPaymentMethod] = useState<string | null>("stripe");
  const hasUserActiveSubscription = userSubscriptions?.find((el) => el.status === "active");
  const { notify } = useNotification();
  const [updatePending, setUpdatePending] = useState(false);

  const handleUpdate = async () => {
    if (paymentMethod && params.get("plan")) {
      setUpdatePending(true);
      const { errorMessage } = await updateSubscriptionAction(params.get("plan") as SubscriptionType, paymentMethod);
      setUpdatePending(false);
      if (!errorMessage) {
        router.push(`${routes.user.subscription.fullUrl}?success=true`);
      } else {
        notify({ title: "Subscription Update", description: errorMessage }, { variant: "error" });
      }
    }
  };

  useEffect(() => {
    if (hasUserActiveSubscription && paymentMethod && paymentMethod?.length > 0) {
      const cardId = userPaymentMethods?.find((el) => el.isDefault)?.id;
      setPaymentMethod(cardId || userPaymentMethods![0].id);
    }
  }, [hasUserActiveSubscription, paymentMethod, userPaymentMethods]);

  return (
    <div className="border border-grey-100 rounded-2xl w-full bg-white">
      <h1 className="px-6 pt-6 pb-4 border-b border-b-grey-100 md:text-lg font-medium md:font-semibold">Payment Method</h1>
      <div className="space-y-8 px-6 py-4 pb-6">
        <div className="">
          <div className="space-y-4 md:Space-y-6">
            {hasUserActiveSubscription &&
              userPaymentMethods?.map((el) => (
                <RadioButton
                  key={el.id}
                  name={el.id}
                  onChange={() => setPaymentMethod(el.id)}
                  labelClassName="font-normal"
                  label={
                    <div className="flex items-center gap-3 md:gap-4">
                      <p>
                        {"**** "}
                        {el.last4} ({el.brand})
                      </p>
                      {/* <div className="flex items-center gap-4">
                      <div className="relative w-8 h-2.5">
                        <Image src="/visa.png" fill className="w-full h-full absolute" alt="" />
                      </div>
                      <div className="relative w-7 h-4">
                        <Image src="/mastercard.png" fill className="w-full h-full absolute" alt="" />
                      </div>
                      <div className="relative w-6 h-5">
                        <Image src="/amex.png" fill className="w-full h-full absolute" alt="" />
                      </div>
                    </div> */}
                    </div>
                  }
                  checked={paymentMethod === el.id}
                />
              ))}
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
