"use client";

import Image from "next/image";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { IStripePaymentMethods } from "@/types/subscriptions";
import RadioButton from "../shared/forms/RadioButton";
import Stripe from "./stripe/stripe";

const PaymentMethods = ({ userPaymentMethods }: { userPaymentMethods?: IStripePaymentMethods | null }) => {
  const searchParams = useSearchParams();
  const [paymentMethod, setPaymentMethod] = useState<string | null>("stripe");

  return (
    <div className="border border-grey-100 rounded-2xl w-full bg-white">
      <h1 className="px-6 pt-6 pb-4 border-b border-b-grey-100 md:text-lg font-medium md:font-semibold">Payment Method</h1>
      <div className="space-y-8 px-6 py-4 pb-6">
        <div className="">
          <div className="space-y-4 md:Space-y-6">
            {userPaymentMethods?.data.map((el) => (
              <RadioButton
                key={el.id}
                name={el.id}
                onChange={() => setPaymentMethod(el.id)}
                labelClassName="font-normal"
                label={
                  <div className="flex items-center gap-3 md:gap-4">
                    <p>
                      {"**** "}
                      {el.card.last4} ({el.card.brand})
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
            <RadioButton
              name="stripe"
              onChange={() => setPaymentMethod("stripe")}
              labelClassName="font-normal"
              label={
                <div className="flex items-center gap-3 md:gap-4">
                  <p>Credit/Debit Card</p>
                  <div className="flex items-center gap-4">
                    <div className="relative w-8 h-2.5">
                      <Image src="/visa.png" fill className="w-full h-full absolute" alt="" />
                    </div>
                    <div className="relative w-7 h-4">
                      <Image src="/mastercard.png" fill className="w-full h-full absolute" alt="" />
                    </div>
                    <div className="relative w-6 h-5">
                      <Image src="/amex.png" fill className="w-full h-full absolute" alt="" />
                    </div>
                  </div>
                </div>
              }
              checked={paymentMethod === "stripe"}
            />
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
        {paymentMethod === "stripe" && <Stripe key={searchParams.toString()} />}
        {/* {paymentMethod === "paypal" && <Paypal />} */}
      </div>
    </div>
  );
};

export default PaymentMethods;
