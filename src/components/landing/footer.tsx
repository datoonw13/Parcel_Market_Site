import routes from "@/helpers/routes";
import Logo from "@/icons/Logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const LandingFooter = ({ className }: { className?: string }) => (
  <div className={cn("px-5 sm:px-8 md:px-11 lg:px-16 xl:px-[11vw] space-y-6 lg:border-t lg:border-t-grey-100 lg:pt-11", className)}>
    <div className="flex flex-col lg:flex-row lg:items-center w-full space-y-8 lg: justify-between">
      <Logo className="w-[85px] h-6 sm:w-24 sm:h-8 md:w-32 md:h-8 lg:w-[140px] lg:h-10 " />
      <ul className="border-t border-t-grey-100 lg:border-t-0 lg:!mt-0 pt-8 lg:pt-0 grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap gap-3">
        <li className="cursor-pointer text-sm text-grey-800 ">About us</li>
        <Link href={routes.privacyPolicy.fullUrl}>
          <li className="cursor-pointer text-sm text-grey-800 ">Privacy Policy</li>
        </Link>
        <Link href={routes.termsConditions.fullUrl}>
          <li className="cursor-pointer text-sm text-grey-800 ">Terms of use</li>
        </Link>
        <li className="cursor-pointer text-sm text-grey-800 ">Pricing</li>
        <li className="cursor-pointer text-sm text-grey-800 ">My resent search</li>
        <li className="cursor-pointer text-sm text-grey-800 ">Value of the land tool</li>
        <li className="cursor-pointer text-sm text-grey-800 ">Investing</li>
      </ul>
    </div>

    <p className="border-t border-t-grey-100 pt-6 text-xs font-medium text-grey-600 text-center lg:text-start pb-16">
      ©{new Date().getFullYear()} Parcel Market. All rights reserved.
    </p>
  </div>
);

export default LandingFooter;
