"use client";

import HomeHeaderWrapper from "@/components/home-new/header/header-wrapper";
import ScheduleDemo from "@/components/home-new/schedule-demo";
import SlideShow from "@/components/home-new/slideshow/slideshow";
import VoltEffort from "@/components/home-new/volt-effort";
import VoltDescription from "@/components/home-new/volt-description/volt-description";
import VoltPeopleFeedback from "@/components/home-new/volt-people-feedback";
import VoltQuestions from "@/components/home-new/volt-questions";
import VoltVideo from "@/components/home-new/volt-video";
import { getUserAction } from "@/server-actions/user/actions";
import dynamic from "next/dynamic";
import VoltSupport from "@/components/home-new/volt-support";
import HomeUpdatesSection from "@/components/home-new/updates";

const VoltFeatures = dynamic(() => import("@/components/home-new/volt-features"), { ssr: false });
const VoltSubscription = dynamic(() => import("@/components/home-new/volt-subscription/volt-subscription"), { ssr: false });

const HomePage = () => (
  // const user = await getUserAction();
  <div className="bg-[#fdfdfd]">
    <div className="h-screen lg:h-[76.5vh] flex flex-col">
      <HomeHeaderWrapper user={null} />
      <SlideShow />
    </div>
    <VoltDescription />
    <VoltVideo />
    <ScheduleDemo />
    <VoltFeatures />
    <VoltEffort />
    <VoltSubscription userActiveSubscription={undefined} />
    <VoltQuestions />
    <VoltPeopleFeedback />
    <VoltSupport />
    <HomeUpdatesSection />
    <div className="mt-20">qwd</div>
  </div>
);
export default HomePage;
