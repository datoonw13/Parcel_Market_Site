"use client";

import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input";
import { IoSearchOutline } from "react-icons/io5";
import { TbFilter } from "react-icons/tb";
import { Suspense, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const RecentSearchesDesktopFilters = dynamic(() => import("./desktop"), { ssr: false });

const RecentSearchesFilters = () => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleSearch = () => {};

  useEffect(
    () => () => {
      window.clearTimeout(timerRef.current);
    },
    []
  );
  return (
    <div className="grid grid-cols-[1fr_minmax(0,_max-content)] 2xl:grid-cols-[minmax(auto,_324px)_minmax(0,_max-content)] gap-3 2xl:gap-16 w-full justify-between items-center">
      <TextInput
        rootClassName="min-h-9 h-full rounded-3xl"
        className="text-grey-800 placeholder:text-grey-800 placeholder:text-xs text-xs font-medium"
        placeholder="Search by Parcel ID, or by owner "
        endIconClassName="p-[1px]"
        endIcon={
          <div className="bg-primary-main h-full rounded-full text-white flex items-center justify-center cursor-pointer aspect-square">
            <IoSearchOutline />
          </div>
        }
      />
      <div className="2xl:hidden ml-auto">
        <Button className="p-2.5 h-fit !bg-transparent text-grey-800 border border-grey-100 !rounded-xl">
          <div className="flex gap-2 items-center">
            <TbFilter className="size-5" style={{ transform: "scale(-1, 1)" }} />
            <span className="hidden md:block text-grey-600">Filter</span>
          </div>
        </Button>
      </div>
      <Suspense>
        <RecentSearchesDesktopFilters />
      </Suspense>
    </div>
  );
};
export default RecentSearchesFilters;
