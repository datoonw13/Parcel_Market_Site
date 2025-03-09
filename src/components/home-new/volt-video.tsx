"use client";

import Link from "next/link";
import routes from "@/helpers/routes";
import { Button } from "../ui/button";

const VoltVideo = () => (
  <div className="items-center pt-8 md:pt-0 mt-16 sm:mt-20 md:mt-28 lg:mt-40 xl:mt-44 flex flex-col lg:grid lg:grid-cols-[1.4fr_1fr] gap-6 max-w-6xl mx-auto lg:px-8 xl:px-20">
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
    <div className="w-full lg:order-1 shadow-[0px_17.56px_42.15px_0px_rgba(0,0,0,0.08)] p-4 rounded-b-2xl lg:rounded-2xl h-52 md:h-64 lg:h-72 xl:h-80">
      <div className="bg-black-200 w-full h-full rounded-2xl">Video</div>
    </div>
    <Link className="w-full px-4 lg:hidden" href={routes.volt.fullUrl}>
      <Button className="w-full">Try For Free</Button>
    </Link>
  </div>
);

export default VoltVideo;
