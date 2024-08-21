import Marketplace from "@/components/@new/marketplace/list/marketplace";
import MarketplaceList from "@/components/@new/marketplace/list/marketplace-list";
import MarketplaceListLoading from "@/components/@new/marketplace/list/marketplace-list-loading";
import routes from "@/helpers/routes";
import { getMarketplaceListAction } from "@/server-actions/marketplace/action";
import { getUserAction } from "@/server-actions/user/actions";
import { marketplaceFiltersValidations } from "@/zod-validations/filters-validations";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const PAGE_SIZE = 6;

const MarketPlacePage = async ({ searchParams }: { searchParams: any }) => {
  const filters = marketplaceFiltersValidations.safeParse(searchParams);
  if (!filters.success) {
    redirect(`${routes.marketplace.fullUrl}?page=1`);
  }

  const { data } = await getMarketplaceListAction(PAGE_SIZE, { page: 1 });
  const totalCount = data?.pagination.totalCount || 0;
  const user = await getUserAction();

  return (
    <Marketplace initialData={data} user={user} totalCount={totalCount}>
      {filters.success && (
        <Suspense fallback={<MarketplaceListLoading />} key={JSON.stringify(filters.data)}>
          <MarketplaceList filters={filters.data} pageSize={PAGE_SIZE} totalCount={totalCount} />
        </Suspense>
      )}
    </Marketplace>
  );
};

export default MarketPlacePage;
