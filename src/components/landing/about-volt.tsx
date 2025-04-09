/* eslint-disable jsx-a11y/media-has-caption */
import Link from "next/link";
import React from "react";
import routes from "@/helpers/routes";
import { Button } from "../ui/button";
import IntroVideo from "../shared/intro-video";

const AboutVolt = () => (
  <div
    className={`
          mx-auto w-full
          px-4 sm:px-5 md:px-7 lg:px-14 xl:px-[9vw]
          space-y-6 md:space-y-8 lg:space-y-11
          mt-16
          `}
  >
    <div className="space-y-2 md:space-y-3 max-w-3xl mx-auto">
      <h1 className="text-center font-extrabold text-2xl md:text-3xl lg:text-4xl xl:text-5xl">VOLT - Value of Land Tool</h1>
      <h2 className="text-center font-light text-sm md:text-base">
        VOLT is the first free, no obligation land value information tool to hit the web! By using proprietary algorithms and county sale
        data, VOLT is able to estimate an average value for similar sized properties in a market area. You can also use VOLT to search,
        save, and export county sales data.
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] items-center gap-6 md:gap-10 lg:gap-16 xl:gap-24">
      <div className="h-56 sm:h-60 md:h-72 lg:h-80 xl:h-[400px] rounded-2xl">
        {/* <video playsInline width="100%" height="100%" className="w-full h-full" poster="/subnail.png" controls preload="metadata">
          <source src="https://hjpblcir9dyus8x7.public.blob.vercel-storage.com/video-QpygzeA5DFEAdEKsmJD9zdki3xxwSe.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video> */}
        <IntroVideo />
      </div>
      <div className="h-fit space-y-2 md:space-y-3">
        <h1 className="font-bold text-xl sm:text-2xl md:text-3xl lg:font-extrabold lg:text-4xl xl:text-5xl">How Does Volt work?</h1>
        <h1 className="font-extralight text-sm md:text-base">
          VOLT quickly delivers comparable sales data and calculates sold price averages so that you can understand vacant land markets
          surrounding a specific property faster than ever before.
        </h1>
        <Link className="w-full" href={routes.volt.fullUrl}>
          <Button className="mt-6 md:mt-8 w-full md:w-fit" id="landing-about-volt-button">
            Try for free
          </Button>
        </Link>
      </div>
    </div>
  </div>
);

export default AboutVolt;
