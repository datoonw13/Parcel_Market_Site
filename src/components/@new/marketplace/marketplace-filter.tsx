import { SortEnum } from "@/types/common";
import Sort from "../shared/filters/Sort";
import MarketPlaceMobileFilters from "./marketplace-mobile-filters";
import MarketPlaceDesktopFilters from "./marketplace-desktop-filters";

const MarketPlaceFilters = () => {
  console.log("aqa");

  return (
    <div className="mb-6 md:mb-8 lg:mb-10">
      <div className="flex justify-between items-center gap-2">
        <MarketPlaceDesktopFilters />
        <MarketPlaceMobileFilters />
        <div className="flex items-center gap-3 justify-end">
          <p className="hidden sm:block text-grey-600 text-xs">1326,000 Lands</p>
          <Sort options={SortEnum} />
        </div>
      </div>
    </div>
  );
};

export default MarketPlaceFilters;
