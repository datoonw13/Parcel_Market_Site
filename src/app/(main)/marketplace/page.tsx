import MarketPlaceFilters from "@/components/@new/marketplace/list/marketplace-filter";
import MarketplaceHeader from "@/components/@new/marketplace/list/marketplace-header";
import MarketplaceList from "@/components/@new/marketplace/list/marketplace-list";
import MarketplaceListLoading from "@/components/@new/marketplace/list/marketplace-list-loading";
import Container from "@/components/@new/shared/Container";
import React, { Suspense } from "react";

const MarketPlacePage = ({ searchParams }: { searchParams: { [key: string]: string } }) => (
  <Container className="py-6 md:py-8">
    <MarketplaceHeader />
    <Suspense fallback={<div className="animate-pulse bg-primary-main-100 w-full rounded-xl h-9 mb-6 md:mb-8 lg:mb-10" />}>
      <MarketPlaceFilters />
    </Suspense>
    <div>
      <Suspense key={JSON.stringify(searchParams)} fallback={<MarketplaceListLoading />}>
        <MarketplaceList params={searchParams} />
      </Suspense>
    </div>
  </Container>
);

export default MarketPlacePage;
