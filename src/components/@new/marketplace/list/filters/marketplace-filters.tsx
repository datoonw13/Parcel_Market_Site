"use client";

import { SortEnum } from "@/types/common";
import { IDecodedAccessToken } from "@/types/auth";
import { FC, useEffect, useRef } from "react";
import TextField from "@/components/@new/shared/forms/text-field";
import { IoSearchOutline } from "react-icons/io5";
import { cn } from "@/helpers/common";
import { IMarketplaceFilters } from "@/types/lands";
import Sort from "@/components/@new/filters/sort";
import MarketplaceDesktopFilters from "./marketplace-desktop-filters";
import MarketplaceMobileFilters from "./marketplace-mobile-filters";

interface MarketPlaceFiltersProps {
  selectedFilters: IMarketplaceFilters;
  onChange: <T extends keyof IMarketplaceFilters>(data: { [key in T]: IMarketplaceFilters[T] }) => void;
  totalCount: number;
  user: IDecodedAccessToken | null;
}
const MarketPlaceFilters: FC<MarketPlaceFiltersProps> = ({ totalCount, user, selectedFilters, onChange }) => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleSearch = (value: string) => {
    timerRef.current && window.clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange({ search: value || null });
    }, 300);
  };

  useEffect(() => timerRef.current && window.clearTimeout(timerRef.current), []);

  return (
    <div className="space-y-10 md:space-y-12">
      <TextField
        disabled={!user?.isSubscribed}
        onChange={handleSearch}
        className="max-w-96 [&>input]:rounded-3xl [&>input]:h-11 m-auto"
        placeholder="Search by: parcel ID, owner, acreage, VOLT value"
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
            <MarketplaceMobileFilters disabled={!user?.isSubscribed} onChange={onChange} selectedFilters={selectedFilters} />
          </div>
          <div className="hidden lg:flex">
            <MarketplaceDesktopFilters onChange={onChange} selectedFilters={selectedFilters} disabled={!user?.isSubscribed} />
          </div>
          <div className="flex items-center gap-3 justify-end min-w-max">
            <p className="text-grey-600 text-xs">{totalCount} Properties</p>
            <Sort
              value={selectedFilters.sortBy}
              onChange={(sortBy: any) => onChange({ sortBy })}
              disabled={!user?.isSubscribed}
              options={SortEnum}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPlaceFilters;
