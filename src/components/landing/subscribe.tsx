"use client";

import Slider from "react-slick";
import { FaArrowRightLong } from "react-icons/fa6";
import { useRef } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Link from "next/link";
import routes from "@/helpers/routes";
import { GiCheckMark } from "react-icons/gi";
import { Button } from "../ui/button";

export default function Subscribe() {
  const { targetReached } = useMediaQuery(1024);
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
          slidesToShow: 2,
          slidesToScroll: 2,
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

  return (
    <div className="space-y-6 md:space-y-8 lg:space-y-11">
      <div className="space-y-2 md:space-y-3 max-w-3xl mx-auto hidden lg:block">
        <h1 className="text-center font-extrabold text-2xl md:text-3xl lg:text-4xl xl:text-5xl">How Valuable is Your Time?</h1>
        <h2 className="text-center font-light text-sm md:text-base">
          Subscribe for full access to VOLT and sales data and save hours of property research.
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
        <h1 className="font-extrabold text-2xl md:text-3xl lg:hidden text-center">How Would You like to Pay?</h1>
        <Slider
          onInit={() => {
            if (targetReached && sliderRef.current) {
              sliderRef.current?.slickGoTo(0);
            }
          }}
          ref={sliderRef}
          {...settings}
          className="overflow-hidden lg:mx-10 xl:mx-20"
        >
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-grey-100 text-black h-[256px]">
            <h2 className="font-medium text-xs text-primary-main mb-4 uppercase">Risk Free! No Payment Info Required</h2>
            <h1 className="text-[44px] font-bold mb-7 md:mb-8">
              Free <span className="text-base font-normal">/ 7 Days</span>
            </h1>
            <Link href={routes.user.subscription.fullUrl}>
              <Button className="flex w-full [&>span]:w-full bg-primary-main-100 hover:bg-primary-main-200">
                <div className="flex items-center justify-between gap-2 w-full text-primary-main font-semibold">
                  Try For Free <FaArrowRightLong />
                </div>
              </Button>
            </Link>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-grey-100 text-black h-[270px]">
            <h2 className="font-medium text-base text-primary-main mb-4 uppercase">save 10% per month</h2>
            <h1 className="text-[44px] font-bold mb-7 md:mb-8">
              <span className="font-bold text-2xl">$</span>215 <span className="text-base font-normal">/ Annual</span>
            </h1>
            <Link href={routes.user.subscription.fullUrl}>
              <Button className="flex w-full [&>span]:w-full ">
                <div className="flex items-center justify-between gap-2 w-full  font-semibold">
                  Subscribe <FaArrowRightLong />
                </div>
              </Button>
            </Link>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-grey-100 text-black h-[256px]">
            <h2 className="font-medium text-xs text-primary-main mb-4 uppercase">Per month</h2>
            <h1 className="text-[44px] font-bold mb-7 md:mb-8">
              <span className="font-bold text-2xl">$</span>20 <span className="text-base font-normal">/ monthly</span>
            </h1>
            <Link href={routes.user.subscription.fullUrl}>
              <Button className="flex w-full [&>span]:w-full bg-primary-main-100 hover:bg-primary-main-200">
                <div className="flex items-center justify-between gap-2 w-full text-primary-main font-semibold">
                  Subscribe <FaArrowRightLong />
                </div>
              </Button>
            </Link>
          </div>
        </Slider>
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
            <li key={item} className="text-sm md:text-base font-medium flex items-start gap-2 text-start">
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
  "Conveniently Save Sales Data",
  "Sales Data Updated Weekly",
  "VOLT quickly filters out unqualified sales",
  "Quickly Evaluate Land Deals in Seconds",
  "Save hours of research time",
  "Export Sales Data to KML or XML",
  "Data Direct from County Accessors",
  "Created for professionals, investors and landowners",
];
