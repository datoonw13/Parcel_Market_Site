import LandingHeader from "@/components/landing/header";
import React from "react";
import LandingSlider from "@/components/landing/slider";
import AboutVolt from "@/components/landing/about-volt";
import dynamic from "next/dynamic";

const LandingSubscribe = dynamic(() => import("@/components/landing/subscribe"), { ssr: false });
const PeopleFeedback = dynamic(() => import("@/components/landing/people-feedback"), { ssr: false });

const LandingPage = () => (
  <div className="flex flex-col gap-11 sm:gap-12 md:gap-16 lg:gap-22 xl:gap-28 2xl:gap-32">
    <div>
      <LandingHeader />
      <LandingSlider />
      <AboutVolt />
    </div>
    <LandingSubscribe />
    <PeopleFeedback />
  </div>
);

export default LandingPage;
