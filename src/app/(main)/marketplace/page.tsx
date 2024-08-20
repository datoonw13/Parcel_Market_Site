import MarketPlaceFilters from "@/components/@new/marketplace/list/filters/marketplace-filters";
import MarketplaceHeader from "@/components/@new/marketplace/list/marketplace-header";
import MarketplaceList from "@/components/@new/marketplace/list/marketplace-list";
import MarketplaceListLoading from "@/components/@new/marketplace/list/marketplace-list-loading";
import Container from "@/components/@new/shared/Container";
import SubscriptionAlert from "@/components/@new/shared/subscription-alert";
import React, { Suspense } from "react";

const MarketPlacePage = async ({ searchParams }: { searchParams: { [key: string]: string } }) => (
  <Container className="py-6 md:py-8">
    <SubscriptionAlert />
    <div className="space-y-10 md:space-y-8">
      <MarketplaceHeader />
      <MarketPlaceFilters />
    </div>
    <div className="mt-6 md:mt-10">
      <Suspense key={JSON.stringify(searchParams)} fallback={<MarketplaceListLoading />}>
        <MarketplaceList params={searchParams} />
      </Suspense>
    </div>
  </Container>
);

export default MarketPlacePage;
