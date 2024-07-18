"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { ArrowIconLeftFilled1 } from "../../icons/ArrowIcons";
import { SearchIcon1 } from "../../icons/SearchIcons";
import TextField from "../../shared/forms/text-field";

const MarketplaceHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleSearch = (value: string) => {
    timerRef.current && window.clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      router.replace(`${pathname}?${params.toString()}`);
    }, 300);
  };

  useEffect(() => timerRef.current && window.clearTimeout(timerRef.current), []);

  return (
    <div className="mb-10 md:mb-12">
      <div className="flex items-center gap-1.5 cursor-pointer mb-8 md:mb-10">
        <p className="text-sm text-grey-800">Homepage</p>
        <div className="w-5 h-5 flex items-center justify-center">
          <ArrowIconLeftFilled1 className="!w-1.5 h-1.5" color="primary-main" />
        </div>
        <p className="text-sm text-primary-main font-medium">Lands Marketplace</p>
      </div>
      <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-center">Parcel Marketplace</h1>
        <h6 className="font-medium md:text-sm md:text-grey-800 text-center max-w-3xl m-auto">
          Welcome to Parcel Marketplace where investors and sellers can connect for unique, off-market land opportunities. Browse listings
          below and connect with a buyer or seller today!
        </h6>
      </div>
      <TextField
        onChange={handleSearch}
        className="max-w-96 [&>input]:rounded-3xl [&>input]:h-11 m-auto"
        placeholder="Enter any keyword to search"
        endIconClasses="!pr-1 !h-fit"
        endIcon={
          <div className="bg-primary-main h-9 w-9 rounded-full flex items-center justify-center">
            <SearchIcon1 color="white" />
          </div>
        }
      />
    </div>
  );
};

export default MarketplaceHeader;
