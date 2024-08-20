"use client";

import { SortEnum } from "@/types/common";
import Sort from "@/components/@new/shared/filters/Sort";
import { IDecodedAccessToken } from "@/types/auth";
import useMediaQuery from "@/hooks/useMediaQuery";
import MarketplaceDesktopFilters from "./marketplace-desktop-filters";

const MarketPlaceFiltersWrapper = ({ totalLends, user }: { totalLends: number; user: IDecodedAccessToken | null }) => {
  const isSmallDevice = useMediaQuery(1024);
  return (
    <div className="mb-6 md:mb-8 lg:mb-10">
      <div className="flex justify-between items-center gap-5 lg:gap-32 xl:gap-60">
        {isSmallDevice ? "" : <MarketplaceDesktopFilters disabled={!user?.isSubscribed} />}
        <div className="flex items-center gap-3 justify-end min-w-max">
          <p className="text-grey-600 text-xs">{totalLends} Properties</p>
          <Sort disabled={!user?.isSubscribed} options={SortEnum} />
        </div>
      </div>
    </div>
  );
};

export default MarketPlaceFiltersWrapper;
