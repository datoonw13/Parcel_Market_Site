import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const VoltFooter = () => (
  <div className={cn("space-y-4 pt-4 md:pt-6 md:pb-8 mt-auto")}>
    <div className="flex gap-3 items-center justify-center lg:justify-start">
      <Link href="/">
        <p className="text-sm text-gray-800">Privacy Policy</p>
      </Link>
      <div className="w-[1px] h-4 bg-gray-200" />
      <Link href="/">
        <p className="text-sm text-gray-800">Terms of use</p>
      </Link>
    </div>
    <p className="text-xs font-medium text-grey-600 text-center lg:text-start">
      ©{new Date().getFullYear()} Parcel Market. All rights reserved.
    </p>
  </div>
);

export default VoltFooter;
