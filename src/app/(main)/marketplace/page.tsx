import MarketPlaceFilters from "@/components/@new/marketplace/marketplace-filter";
import MarketplaceHeader from "@/components/@new/marketplace/marketplace-header";
import MarketplaceList from "@/components/@new/marketplace/marketplace-list";
import MarketplaceListLoading from "@/components/@new/marketplace/marketplace-list-loading";
import Container from "@/components/@new/shared/Container";
import React, { Suspense } from "react";

const MarketPlacePage = ({ searchParams }: { searchParams: { [key: string]: string } }) => (
  <Container className="py-6 md:py-8">
    <MarketplaceHeader />
    <MarketPlaceFilters />
    <div>
      <Suspense key={JSON.stringify(searchParams)} fallback={<MarketplaceListLoading />}>
        <MarketplaceList params={searchParams} />
      </Suspense>
    </div>
  </Container>
);

export default MarketPlacePage;
