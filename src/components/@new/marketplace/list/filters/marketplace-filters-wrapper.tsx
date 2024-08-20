"use client";

import { SortEnum } from "@/types/common";
import Sort from "@/components/@new/shared/filters/Sort";
import { IDecodedAccessToken } from "@/types/auth";
import { IMarketplaceFilters } from "@/types/lands";
import { useEffect, useRef, useState } from "react";
import TextField from "@/components/@new/shared/forms/text-field";
import { IoSearchOutline } from "react-icons/io5";
import { cn } from "@/helpers/common";
import MarketplaceDesktopFilters from "./marketplace-desktop-filters";
import MarketplaceMobileFilters from "./marketplace-mobile-filters";

const MarketPlaceFiltersWrapper = ({ totalLends, user }: { totalLends: number; user: IDecodedAccessToken | null }) => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const [filters, setFilters] = useState<IMarketplaceFilters>({
    search: "",
    states: null,
    counties: null,
    acreageMin: null,
    acreageMax: null,
    page: 1,
    sortBy: null,
    voltValueMin: null,
    voltValueMax: null,
  });

  console.log(filters, 22);

  const handleSearch = (value: string) => {
    timerRef.current && window.clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: value || null }));
    }, 300);
  };

  useEffect(() => timerRef.current && window.clearTimeout(timerRef.current), []);

  return (
    <div className="space-y-10 md:space-y-12">
      <TextField
        disabled={!user?.isSubscribed}
        onChange={handleSearch}
        className="max-w-96 [&>input]:rounded-3xl [&>input]:h-11 m-auto"
        placeholder="Enter any keyword to search"
        endIconClasses="!pr-1 !h-fit"
        endIcon={
          <div
            className={cn("h-9 w-9 rounded-full flex items-center justify-center", user?.isSubscribed ? "bg-primary-main" : "bg-grey-100")}
          >
            <IoSearchOutline className="text-white" />
          </div>
        }
      />
      <div className="mb-6 md:mb-8 lg:mb-10">
        <div className="flex justify-between items-center gap-5 lg:gap-32 xl:gap-60">
          <div className="flex lg:hidden">
            <MarketplaceMobileFilters disabled={!user?.isSubscribed} filters={filters} setFilters={setFilters} />
          </div>
          <div className="hidden lg:flex">
            <MarketplaceDesktopFilters filters={filters} setFilters={setFilters} disabled={!user?.isSubscribed} />
          </div>
          <div className="flex items-center gap-3 justify-end min-w-max">
            <p className="text-grey-600 text-xs">{totalLends} Properties</p>
            <Sort disabled={!user?.isSubscribed} options={SortEnum} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPlaceFiltersWrapper;
