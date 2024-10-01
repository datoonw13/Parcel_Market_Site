import LandingHeader from "@/components/landing/header";
import React from "react";
import LandingSlider from "@/components/landing/slider";
import AboutVolt from "@/components/landing/about-volt";
import dynamic from "next/dynamic";
import LandingQuestions from "@/components/landing/questions";
import LandingSupport from "@/components/landing/support";
import { getUserAction } from "@/server-actions/user/actions";
import LandingUpdates from "@/components/landing/updates";
import LandingFooter from "@/components/landing/footer";

const LandingSubscribe = dynamic(() => import("@/components/landing/subscribe"), { ssr: false });
const PeopleFeedback = dynamic(() => import("@/components/landing/people-feedback"), { ssr: false });

const LandingPage = async () => {
  const user = await getUserAction();
  return (
    <div className="flex flex-col gap-11 sm:gap-12 md:gap-16 lg:gap-22 xl:gap-28 2xl:gap-32">
      <div>
        <LandingHeader />
        <LandingSlider />
        <AboutVolt />
      </div>
      <LandingSubscribe />
      <PeopleFeedback />
      <LandingQuestions />
      <LandingSupport user={user} />
      <LandingUpdates />
      <LandingFooter />
    </div>
  );
};
export default LandingPage;
