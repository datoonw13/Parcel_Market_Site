import { SortEnum } from "@/types/common";
import { getMarketplaceListAction } from "@/server-actions/marketplace/action";
import { getUserAction } from "@/server-actions/user/actions";
import Sort from "@/components/@new/shared/filters/Sort";
import { IDecodedAccessToken } from "@/types/auth";
import MarketplaceDesktopFilters from "./marketplace-desktop-filters";

const MarketPlaceFiltersWrapper = ({ totalLends, user }: { totalLends: number; user: IDecodedAccessToken | null }) => (
  <div className="mb-6 md:mb-8 lg:mb-10">
    <div className="flex justify-between items-center gap-60">
      <MarketplaceDesktopFilters disabled={!user?.isSubscribed} />
      <div className="flex items-center gap-3 justify-end min-w-max">
        <p className="text-grey-600 text-xs">{totalLends} Properties</p>
        <Sort disabled={!user?.isSubscribed} options={SortEnum} />
      </div>
    </div>
  </div>
);

export default MarketPlaceFiltersWrapper;
