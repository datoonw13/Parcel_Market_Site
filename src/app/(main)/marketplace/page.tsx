import MarketplaceList from "@/components/@new/marketplace/list/marketplace-list";
import { getMarketplaceListAction } from "@/server-actions/marketplace/action";
import { getUserAction } from "@/server-actions/user/actions";

const PAGE_SIZE = 6;

const MarketPlacePage = async () => {
  const { data } = await getMarketplaceListAction(PAGE_SIZE);
  const user = await getUserAction();
  return <MarketplaceList initialData={data} user={user} pageSize={PAGE_SIZE} />;
};

export default MarketPlacePage;
