"use client";

import { subscribeAction } from "@/server-actions/common-actions";
import { useState } from "react";
import { emailSchema } from "@/zod-validations/auth-validations";
import useNotification from "@/hooks/useNotification";
import Link from "next/link";
import routes from "@/helpers/routes";
import { TextInput } from "../ui/input";
import { Button } from "../ui/button";

const LandingUpdates = () => {
  const { notify } = useNotification();
  const [subscribePending, setSubscribePending] = useState(false);
  const [email, setEmail] = useState("");
  const isValidEmail = !!emailSchema.safeParse(email).success;

  const handleSubscribe = async () => {
    if (isValidEmail) {
      setSubscribePending(true);
      const { errorMessage } = await subscribeAction(email);
      if (!errorMessage) {
        notify({ title: "Subscription successful", description: "You'll receive parcel market updates by email" });
      }
      setSubscribePending(false);
    }
  };

  return (
    <div className="px-5 sm:px-8 md:px-11 space-y-6 md:space-y-8 lg:space-y-11">
      <div className="space-y-2 md:space-y-3 max-w-3xl mx-auto">
        <h1 className="text-center font-extrabold text-2xl md:text-3xl lg:text-4xl xl:text-5xl">Get the Latest Updates</h1>
        <h2 className="text-center font-light text-sm md:text-base">
          Interested in hearing about the newest features and updates? Join Parcel Market Newsletter and never miss an update.
        </h2>
      </div>
      <div className="space-y-3 max-w-96 mx-auto">
        <div className="space-y-2">
          <TextInput placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button disabled={!isValidEmail} loading={subscribePending} onClick={handleSubscribe} className="w-full">
            Subscribe
          </Button>
        </div>
        <p className="font-extralight text-center">
          We’ll never share your details with third parties. View our <Link href={routes.privacyPolicy.fullUrl}>Privacy Policy</Link> for
          more info.
        </p>
      </div>
    </div>
  );
};

export default LandingUpdates;
