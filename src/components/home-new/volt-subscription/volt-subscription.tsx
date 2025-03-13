"use client";

import { useRef, useState } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { cn } from "@/lib/utils";
import { ISubscription, SubscriptionType } from "@/types/subscriptions";
import PlanItem from "@/components/@new/subscription/plans/plan-item";
import { GiCheckMark } from "react-icons/gi";
import Image from "next/image";
import { IUserBaseInfo } from "@/types/auth";
import PlanList from "../../@new/subscription/plans/plan-list";
import styles from "./styles.module.css";

const VoltSubscription = ({ user, subscriptionType }: { user: IUserBaseInfo | null; subscriptionType: ISubscription | null }) => {
  const swiperRef = useRef<SwiperRef | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className="mt-16 sm:mt-20 lg:mt-28 xl:mt-32 flex flex-col" id="subscription">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-20 mb-8 lg:mb-11">
        <h1 className="lg:text-center text-start font-extrabold text-2xl">How Valuable is your time?</h1>
        <h2 className="lg:text-center text-start font-light">
          Subscribe for full access to VOLT and sales data and save hours of property research.
        </h2>
      </div>

      <div className="relative max-w-7xl w-full mx-auto pl-4 lg:px-8 xl:px-20 mb-8 lg:mb-11 lg:p-6 lg:bg-[#F9F9F9] border border-[rgba(219, 219, 219, 0.1)]  lg:rounded-2xl">
        <Image src="/dots.svg" fill className="w-full h-full absolute object-cover rounded-2xl hidden lg:block" alt="" />

        <Swiper
          ref={swiperRef}
          autoplay={{
            delay: 250000,
            disableOnInteraction: false,
          }}
          onSlideChange={(e) => {
            setActiveIndex(e.realIndex);
          }}
          spaceBetween={30}
          effect="fade"
          navigation
          modules={[Autoplay, Pagination]}
          className={cn(
            "mySwiper [&>.swiper-pagination]:!absolute [&>.swiper-pagination]:justify-center [&>.swiper-pagination]:!bottom-10 [&>.swiper-pagination]:flex"
          )}
          breakpoints={{
            0: {
              slidesPerView: 1.2,
            },
            600: {
              slidesPerView: 1.5,
            },
            780: {
              slidesPerView: 1.8,
            },
            1000: {
              slidesPerView: 2.2,
            },
            1124: {
              slidesPerView: 2.7,
              navigation: false,
            },
            1280: {
              slidesPerView: 3,
            },
          }}
        >
          <SwiperSlide className="[&>*]:text-black group !h-[249px]">
            <div className="h-full">
              <div className="flex items-center h-full w-full md:transition-all md:duration-100">
                <div className="flex flex-col h-full bg-white p-6 md:p-8 rounded-2xl border border-grey-100 text-black w-full group-hover:h-full transition-all duration-100">
                  {!user && (
                    <h2 className="font-medium text-xs text-primary-main text-start uppercase">Risk Free! No Payment Info Required</h2>
                  )}
                  {user && !subscriptionType && (
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded-full bg-success" />
                      <p className="text-success font-medium">Active</p>
                    </div>
                  )}
                  <h1 className="text-5xl font-bold mb-7 md:mb-4 text-start mt-2">Free Plan</h1>
                  <ul className="list-disc list-outside pl-4 mt-auto">
                    <li className="text-sm text-start">included all except pricing and the data export</li>
                  </ul>
                </div>
              </div>
            </div>
          </SwiperSlide>
          {Object.keys(SubscriptionType).map((type) => (
            <SwiperSlide className="[&>*]:text-black !h-[249px] [&>div]:h-full" key={type}>
              <PlanItem key={type} type={type as SubscriptionType} userActiveSubscription={subscriptionType || undefined} />
            </SwiperSlide>
          ))}
        </Swiper>
        <ul className="flex items-center gap-2 mt-3 justify-center xl:hidden">
          {[0, 1, 2].map((i) => (
            <li
              onClick={() => {
                swiperRef.current?.swiper.slideTo(i);
                setActiveIndex(i);
              }}
              key={(i * 2).toString()}
              className={cn(
                styles["swiper-bullet-custom"],
                "bg-primary-main-100",
                activeIndex === i && styles["swiper-bullet-custom-active"],
                activeIndex === i && "bg-primary-main"
              )}
            />
          ))}
        </ul>
        <ul
          className={`
                relative
                border border-primary-main rounded-2xl 
                bg-[#ECF6F0]
                p-5
                grid grid-cols-1 md:grid-cols-2 lg:xl:grid-cols-3 gap-y-4 gap-x-8 mr-4 lg:mr-0 mt-8 md:mt-10 lg:mt-14
                `}
        >
          {list.map((item) => (
            <li key={item} className="text-sm md:text-base font-medium flex items-start gap-2 text-start ">
              <GiCheckMark className="mt-[4px] text-primary-main" /> {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VoltSubscription;

const list = [
  "Evaluate And 90% Faster",
  "Satellite View Mapping",
  "Export Sales Data to KML or XML",
  "Multiple Data Display Formats",
  "Powerful Filtering Options",
  "Quickly Filter Out Outlier Sales",
  "Powerful Sales Analysis in 15-Mile Radius",
  "The Data Directly From County Accessors",
  "Sales Data is Updated Weekly",
];
