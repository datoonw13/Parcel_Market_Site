import { SortEnum } from "@/types/common";
import { getMarketplaceListAction } from "@/server-actions/marketplace/action";
import { getUserAction } from "@/server-actions/user/actions";
import Sort from "../../shared/filters/Sort";
import MarketPlaceMobileFilters from "./marketplace-mobile-filters";
import MarketPlaceDesktopFilters from "./marketplace-desktop-filters";

const MarketPlaceFilters = async () => {
  const { data } = await getMarketplaceListAction();
  const user = await getUserAction();
  return (
    <div className="mb-6 md:mb-8 lg:mb-10">
      <div className="flex justify-between items-center gap-2">
        <MarketPlaceDesktopFilters disabled={!user?.isSubscribed} />
        <MarketPlaceMobileFilters disabled={!user?.isSubscribed} />
        <div className="flex items-center gap-3 justify-end">
          <p className="text-grey-600 text-xs">{data?.pagination.totalCount} Properties</p>
          <Sort disabled={!user?.isSubscribed} options={SortEnum} />
        </div>
      </div>
    </div>
  );
};

export default MarketPlaceFilters;
