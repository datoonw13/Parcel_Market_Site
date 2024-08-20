import { getMarketplaceListAction } from "@/server-actions/marketplace/action";
import { getUserAction } from "@/server-actions/user/actions";
import MarketPlaceFiltersWrapper from "./marketplace-filters-wrapper";

const MarketPlaceFilters = async () => {
  const { data } = await getMarketplaceListAction();
  const user = await getUserAction();
  return <MarketPlaceFiltersWrapper totalLends={data?.pagination.totalCount || 0} user={user} />;
};

export default MarketPlaceFilters;
