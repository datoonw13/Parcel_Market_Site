"use client";

import { subscribeAction } from "@/server-actions/common-actions";
import { useState } from "react";
import { emailSchema } from "@/zod-validations/auth-validations";
import { TextInput } from "../ui/input";
import { Button } from "../ui/button";

const LandingUpdates = () => {
  const [subscribePending, setSubscribePending] = useState(false);
  const [email, setEmail] = useState("");
  const isValidEmail = !!emailSchema.safeParse(email).success;

  const handleSubscribe = async () => {
    if (isValidEmail) {
      setSubscribePending(true);
      await subscribeAction(email);
      setSubscribePending(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 lg:space-y-11">
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
          We’ll never share your details with third parties. View our Privacy Policy for more info.
        </p>
      </div>
    </div>
  );
};

export default LandingUpdates;
