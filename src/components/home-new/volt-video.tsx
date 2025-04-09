/* eslint-disable jsx-a11y/media-has-caption */

"use client";

import Link from "next/link";
import routes from "@/helpers/routes";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Button } from "../ui/button";

const IntroVideo = dynamic(() => import("../shared/intro-video"), { ssr: false });

const VoltVideo = () => (
  <div className="items-center pt-8 md:pt-0 mt-16 sm:mt-20 flex flex-col lg:grid lg:grid-cols-[1.4fr_1fr] gap-6 max-w-7xl mx-auto lg:px-8 xl:px-20">
    <div className="mx-4 px-2 space-y-3 lg:order-2">
      <h1 className="text-center lg:text-start font-extrabold text-2xl">How Does Volt work?</h1>
      <h2 className="text-center lg:text-start font-light">
        Instantly access comparable sales around your property and visualize them in multiple formats. Get automated price calculations,
        generate detailed insights, and seamlessly export data in various formats—all in just seconds
      </h2>
      <Link className="w-full hidden lg:block !mt-6" href={routes.volt.fullUrl}>
        <Button className="w-full">Try For Free</Button>
      </Link>
    </div>
    <div className="aspect-[16/9] h-fit flex w-full lg:order-1 lg:shadow-[0px_17.56px_42.15px_0px_rgba(0,0,0,0.08)] p-4 rounded-b-2xl lg:rounded-2xl md:h-96 lg:w-fit">
      <Suspense fallback={<div className="w-full h-full animate-pulse bg-primary-main-100" />}>
        <IntroVideo />
      </Suspense>
      {/* <video controls width="100%" height="100%" className="w-full rounded-2xl" poster="/subnail.png" preload="metadata" playsInline>
        <source src="https://hjpblcir9dyus8x7.public.blob.vercel-storage.com/video-QpygzeA5DFEAdEKsmJD9zdki3xxwSe.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
    </div>
    <Link className="w-full px-4 lg:hidden" href={routes.volt.fullUrl}>
      <Button className="w-full">Try For Free</Button>
    </Link>
  </div>
);

export default VoltVideo;
