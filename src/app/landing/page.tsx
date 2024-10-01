import LandingHeader from "@/components/landing/header";
import React from "react";
import LandingSlider from "@/components/landing/slider";
import AboutVolt from "@/components/landing/about-volt";

const LandingPage = () => (
  <div className="flex flex-col">
    <LandingHeader />
    <LandingSlider />
    <AboutVolt />
  </div>
);

export default LandingPage;
