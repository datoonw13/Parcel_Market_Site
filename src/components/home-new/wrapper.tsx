"use client";

import { IUserBaseInfo } from "@/types/auth";
import HomeHeaderWrapper from "@/components/home-new/header/header-wrapper";
import ScheduleDemo from "@/components/home-new/schedule-demo";
import SlideShow from "@/components/home-new/slideshow/slideshow";
import VoltEffort from "@/components/home-new/volt-effort";
import VoltDescription from "@/components/home-new/volt-description/volt-description";
import VoltQuestions from "@/components/home-new/volt-questions";
import VoltVideo from "@/components/home-new/volt-video";
import dynamic from "next/dynamic";
import VoltSupport from "@/components/home-new/volt-support";
import HomeUpdatesSection from "@/components/home-new/updates";
import HomeFooterSection from "@/components/home-new/footer";
import { ISubscription } from "@/types/subscriptions";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import routes from "@/helpers/routes";

const VoltFeatures = dynamic(() => import("@/components/home-new/volt-features"), { ssr: false });
const VoltSubscription = dynamic(() => import("@/components/home-new/volt-subscription/volt-subscription"), { ssr: false });
const VoltPeopleFeedback = dynamic(() => import("@/components/home-new/volt-people-feedback"), { ssr: false });

const HomeSectionsWrapper = ({ user, subscriptionType }: { user: IUserBaseInfo | null; subscriptionType: ISubscription | null }) => {
  const [isSubscriptionSectionMounted, setSubscriptionSectionMounted] = useState(false);
  const [scrollIntoPricing, setScrollIntoPricing] = useState(false);
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (isSubscriptionSectionMounted && scrollIntoPricing) {
      const element = document.getElementById("subscription");
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            block: "start",
            behavior: "smooth",
          });
        }, 300);
        setScrollIntoPricing(false);
        setTimeout(() => {
          router.replace(routes.home.fullUrl, { scroll: false });
        }, 1000);
      }
    }
  }, [isSubscriptionSectionMounted, router, scrollIntoPricing]);

  useEffect(() => {
    if (params.get("scrollIntoPricing")) {
      setScrollIntoPricing(true);
    }
  }, [params]);

  return (
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
      <VoltSubscription setMounted={() => setSubscriptionSectionMounted(true)} subscriptionType={subscriptionType} user={user} />
      <VoltQuestions />
      <VoltPeopleFeedback />
      <VoltSupport user={user} />
      <HomeUpdatesSection />
      <HomeFooterSection />
    </div>
  );
};

export default HomeSectionsWrapper;
