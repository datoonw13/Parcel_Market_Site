import { ArrowIconLeftFilled1 } from "@/components/@new/icons/ArrowIcons";
import Container from "@/components/@new/shared/Container";
import Subscription from "@/components/@new/subscription/subscription";
import UserProfileSection from "@/components/@new/user/profile/UserProfileSection";
import React from "react";

const SubscriptionPage = () => (
  <Container className="pt-6 md:pt-8 pb-32">
    <div className="flex items-center gap-1.5 cursor-pointer mb-8 md:mb-10">
      <p className="text-sm text-grey-800">Homepage</p>
      <div className="w-5 h-5 flex items-center justify-center">
        <ArrowIconLeftFilled1 className="!w-1.5 h-1.5" color="primary-main" />
      </div>
      <p className="text-sm text-primary-main font-medium">Pricing</p>
    </div>
    <Subscription />
  </Container>
);

export default SubscriptionPage;
