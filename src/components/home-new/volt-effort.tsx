import routes from "@/helpers/routes";
import Link from "next/link";
import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { Button } from "../ui/button";

const VoltEffort = () => (
  <div className="mt-16 sm:mt-20 lg:mt-22 xl:mt-22 max-w-7xl mx-auto px-4 lg:px-8 xl:px-20 space-y-5 sm:space-y-8 lg:space-y-11">
    <h2 className="font-extrabold text-2xl sm:text-center">Maximize Efficiency, Minimize Effort</h2>
    <div className="flex gap-5 flex-col sm:flex-row">
      <div className="border border-success relative flex flex-col gap-4 shadow-[0px_20px_80px_0px_rgba(0,0,0,0.08)] rounded-3xl p-4 md:p-6">
        <div className="space-y-2 relative z-20">
          <h1 className="font-extrabold text-xl lg:text-2xl text-primary-main">Save Time with Instant Data Access</h1>
          <h2>No more manual research on county websites—get comparable sales and property data in seconds.</h2>
        </div>
        <Link href={routes.volt.fullUrl}>
          <Button className="flex w-full [&>span]:w-full bg-primary-main-100 hover:bg-primary-main-200 group-hover:bg-primary-main">
            <div className="flex items-center justify-between gap-2 w-full text-primary-main font-semibold group-hover:text-white">
              Try for free <FaArrowRightLong />
            </div>
          </Button>
        </Link>
      </div>
      <div className="border border-success relative flex flex-col gap-4 shadow-[0px_20px_80px_0px_rgba(0,0,0,0.08)] rounded-3xl p-4 md:p-6">
        <div className="space-y-2 relative z-20">
          <h1 className="font-extrabold text-xl lg:text-2xl text-primary-main">Make Smarter Investment Decisions</h1>
          <h2>Accurate sales data and automated calculations help you evaluate properties with confidence.</h2>
        </div>
        <Link href={routes.volt.fullUrl}>
          <Button className="flex w-full [&>span]:w-full bg-primary-main-100 hover:bg-primary-main-200 group-hover:bg-primary-main">
            <div className="flex items-center justify-between gap-2 w-full text-primary-main font-semibold group-hover:text-white">
              Try for free <FaArrowRightLong />
            </div>
          </Button>
        </Link>
      </div>
    </div>
  </div>
);

export default VoltEffort;
