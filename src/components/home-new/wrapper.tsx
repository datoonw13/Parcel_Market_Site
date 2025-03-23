"use client";

import { IUserBaseInfo } from "@/types/auth";
import HomeHeaderWrapper from "@/components/home-new/header/header-wrapper";
import ScheduleDemo from "@/components/home-new/schedule-demo";
import SlideShow from "@/components/home-new/slideshow/slideshow";
import VoltEffort from "@/components/home-new/volt-effort";
import VoltDescription from "@/components/home-new/volt-description/volt-description";
import VoltQuestions from "@/components/home-new/volt-questions";
import VoltVideo from "@/components/home-new/volt-video";
import { getUserAction } from "@/server-actions/user/actions";
import dynamic from "next/dynamic";
import VoltSupport from "@/components/home-new/volt-support";
import HomeUpdatesSection from "@/components/home-new/updates";
import HomeFooterSection from "@/components/home-new/footer";
import { ISubscription } from "@/types/subscriptions";

const VoltFeatures = dynamic(() => import("@/components/home-new/volt-features"), { ssr: false });
const VoltSubscription = dynamic(() => import("@/components/home-new/volt-subscription/volt-subscription"), { ssr: false });
const VoltPeopleFeedback = dynamic(() => import("@/components/home-new/volt-people-feedback"), { ssr: false });

const HomeSectionsWrapper = ({ user, subscriptionType }: { user: IUserBaseInfo | null; subscriptionType: ISubscription | null }) => (
  <div className="bg-[#fdfdfd]">
    <div className="h-screen lg:h-[76.5vh] flex flex-col">
      <HomeHeaderWrapper />
      <SlideShow />
    </div>
    <VoltDescription />
    <VoltVideo />
    <ScheduleDemo />
    <VoltFeatures />
    <VoltEffort />
    <VoltSubscription subscriptionType={subscriptionType} user={user} />
    <VoltQuestions />
    <VoltPeopleFeedback />
    <VoltSupport user={user} />
    <HomeUpdatesSection />
    <HomeFooterSection />
  </div>
);

export default HomeSectionsWrapper;
