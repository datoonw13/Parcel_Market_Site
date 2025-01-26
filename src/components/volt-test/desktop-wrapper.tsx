"use client";

import useMediaQuery from "@/hooks/useMediaQuery";
import React, { FC, ReactNode } from "react";
import Logo from "@/icons/Logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import moment from "moment";
import { useAtomValue } from "jotai";
import { ScrollArea } from "../ui/scroll-area";
import { breakPoints } from "../../../tailwind.config";
import { Button } from "../ui/button";
import { voltAtom } from "./volt-atom";

interface IVoltDesktopWrapper {
  children: ReactNode;
}

const VoltDesktopWrapper: FC<IVoltDesktopWrapper> = ({ children }) => {
  const voltAtomValue = useAtomValue(voltAtom);
  const { targetReached: isSmallDevice, detecting } = useMediaQuery(parseFloat(breakPoints.lg));

  if (detecting || (!detecting && isSmallDevice)) {
    return null;
  }

  return (
    <div className="grid grid-cols-[min(39vw,_492px)_1fr] h-screen">
      <div className="w-full h-full grid grid-rows-[minmax(0,_max-content)_1fr_minmax(0,_max-content)] overflow-hidden">
        <Logo className="w-28 xl:w-32 2xl:w-36 mx-10 xl:mx-14 2xl:mx-16 mt-12 xl:mt-14 2xl:mt-16 mb-10 xl:mb-12 2xl:mb-14" />
        <div className="overflow-auto">
          <ScrollArea className="h-full [&>div>div:first-child]:h-full">
            <div className="px-7 xl:px-9 2xl:px-11 space-y-8 flex flex-col justify-between h-full">
              <div className="h-full space-y-8">{children}</div>
              <div className={cn("mt-auto", !voltAtomValue.searchResults ? "pb-6 2xl:pb-8" : "pb-4 2xl:pb-6 pt-6")}>
                <div className="flex gap-3">
                  <Link className="text-sm text-grey-800 border-r border-r-black-100 pr-3" href="/">
                    Privacy Policy
                  </Link>
                  <Link className="text-sm text-grey-800" href="/">
                    Terms of use
                  </Link>
                </div>
                <Link className="text-sm text-grey-600 font-medium" href="/">
                  ©{moment().format("YYYY")} Parcel Market. All rights reserved.
                </Link>
              </div>
            </div>
          </ScrollArea>
        </div>
        <div>
          {voltAtomValue.searchResults && (
            <div className="w-full px-7 xl:px-9 2xl:px-11 pt-4 2xl:pt-6 mb-9 2xl:mb-11 border-t shadow-3">
              <Button className="w-full">Get Data</Button>
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-full bg-error-100">Map</div>
    </div>
  );
};
export default VoltDesktopWrapper;
