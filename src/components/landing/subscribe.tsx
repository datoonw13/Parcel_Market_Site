"use client";

import Slider from "react-slick";
import { FaArrowRightLong } from "react-icons/fa6";
import { useRef, useState } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Link from "next/link";
import routes from "@/helpers/routes";
import { GiCheckMark } from "react-icons/gi";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
// import { useAuthUser } from "../shared/auth-session-provider";

export default function Subscribe() {
  const { targetReached } = useMediaQuery(1024);
  // const { user } = useAuthUser();
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef<Slider | null>(null);
  const settings = {
    className: "center",
    centerMode: targetReached,
    slidesToShow: 3,
    infinite: false,
    swipe: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
          swipe: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          swipe: true,
        },
      },
    ],
  };

  const user = null;

  return (
    <div className="space-y-6 md:space-y-8 lg:space-y-11" id="pricing">
      <div className="space-y-2 md:space-y-3 max-w-3xl mx-auto hidden lg:block">
        <h1 className="text-center font-extrabold text-2xl md:text-3xl lg:text-4xl xl:text-5xl">How Valuable is Your Time?</h1>
        <h2 className="text-center font-light text-sm md:text-base">
          Save hours of property research. Subscribe for full access to VOLT and sales data.
        </h2>
      </div>
      <div
        className={`
      my-20 bg-grey-30
      lg:mx-14 xl:mx-24 2xl:mx-[5.75vw]
      lg:border lg:border-grey-200
      flex flex-col gap-8 md:gap-10 lg:gap-14
      lg:rounded-2xl
      py-[52px] lg:pb-8
      `}
      >
        <h1 className="font-extrabold text-2xl md:text-3xl lg:hidden text-center">How Valuable is Your Time?</h1>
        <div>
          <Slider
            onInit={() => {
              if (targetReached && sliderRef.current) {
                sliderRef.current?.slickGoTo(0);
              }
            }}
            ref={sliderRef}
            {...settings}
            className="overflow-hidden lg:mx-10 xl:mx-20 [&_.slick-track]:!grid [&_.slick-track]:grid-flow-col"
            afterChange={(e) => setActiveSlide(Math.ceil(e))}
          >
            <div className="h-full group">
              <div className="flex items-center h-full w-full md:scale-y-95 md:hover:scale-y-100 md:transition-all md:duration-100">
                <div className="h-full bg-white p-6 md:p-8 rounded-2xl border border-grey-100 text-black w-full group-hover:h-full transition-all duration-100">
                  {!user && <h2 className="font-medium text-xs text-primary-main h-10 uppercase">Risk Free! No Payment Info Required</h2>}
                  {user && (
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded-full bg-success" />
                      <p className="text-success font-medium">Active</p>
                    </div>
                  )}
                  <h1 className="text-[44px] font-bold mb-7 md:mb-8">
                    Free <span className="text-base font-normal">/ 5 Days</span>
                  </h1>
                  {/* <Link id="landing-subscription-try-free-btn" href={routes.user.subscription.fullUrl}>
                    <Button className="flex w-full [&>span]:w-full bg-primary-main-100 hover:bg-primary-main-200 group-hover:bg-primary-main">
                      <div className="flex items-center justify-between gap-2 w-full text-primary-main group-hover:text-white font-semibold">
                        Try For Free <FaArrowRightLong />
                      </div>
                    </Button>
                  </Link> */}
                  <ul className="list-disc list-inside">
                    <li className="text-sm">included all except pricing and the data export</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="h-full group">
              <div className="flex items-center h-full w-full md:scale-y-95 md:hover:scale-y-100 md:transition-all md:duration-100">
                <div className="h-full bg-white p-6 md:p-8 rounded-2xl border border-grey-100 text-black w-full group-hover:h-full transition-all duration-100">
                  <h2 className="font-medium text-base text-primary-main h-10 uppercase">save 10% per month</h2>
                  <h1 className="text-[44px] font-bold mb-7 md:mb-8">
                    <span className="font-bold text-2xl">$</span>215 <span className="text-base font-normal">/ Annual</span>
                  </h1>
                  <Link id="landing-subscription-monthly-btn" href={routes.user.subscription.fullUrl}>
                    <Button className="flex w-full [&>span]:w-full bg-primary-main-100 hover:bg-primary-main-200 group-hover:bg-primary-main">
                      <div className="flex items-center justify-between gap-2 w-full text-primary-main font-semibold group-hover:text-white">
                        Subscribe <FaArrowRightLong />
                      </div>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="h-full group">
              <div className="flex items-center h-full w-full md:scale-y-95 md:hover:scale-y-100 md:transition-all md:duration-100">
                <div className="h-full bg-white p-6 md:p-8 rounded-2xl border border-grey-100 text-black w-full group-hover:h-full transition-all duration-100">
                  <h2 className="font-medium text-xs text-primary-main h-10 uppercase">Per month</h2>
                  <h1 className="text-[44px] font-bold mb-7 md:mb-8">
                    <span className="font-bold text-2xl">$</span>20 <span className="text-base font-normal">/ monthly</span>
                  </h1>
                  <Link id="landing-subscription-annually-btn" href={routes.user.subscription.fullUrl}>
                    <Button className="flex w-full [&>span]:w-full bg-primary-main-100 hover:bg-primary-main-200 group-hover:bg-primary-main">
                      <div className="flex items-center justify-between gap-2 w-full text-primary-main font-semibold group-hover:text-white">
                        Subscribe <FaArrowRightLong />
                      </div>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Slider>
          <ul className="flex gap-2 mx-auto justify-center mt-3 lg:hidden">
            <li className={cn("rounded-full size-2 bg-primary-main-100", activeSlide === 0 && "bg-primary-main")} />
            <li className={cn("rounded-full size-2 bg-primary-main-100", activeSlide === 1 && "bg-primary-main")} />
            <li className={cn("rounded-full size-2 bg-primary-main-100", activeSlide === 2 && "bg-primary-main")} />
          </ul>
        </div>
        <ul
          className={`
        border border-primary-main rounded-2xl 
        bg-primary-main/10 
        p-5
        mx-5 md:mx-6 lg:mx-8
        grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-y-4 gap-x-8 
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
}

const list = [
  "Average land market values in seconds",
  "Conveniently save sales data",
  "Sales data updated weekly",
  "VOLT quickly filters out outlier sales",
  "Quickly evaluate land deals in seconds",
  "Save hours of research time",
  "Export sales data to KML or XML",
  "Data direct from county accessors",
  "Created for professionals, investors and landowners",
];
