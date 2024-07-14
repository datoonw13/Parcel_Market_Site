import MarketplaceList from "@/components/@new/marketplace/marketplace-list";
import MarketplaceListLoading from "@/components/@new/marketplace/marketplace-list-loading";
import React, { Suspense } from "react";

const MarketPlacePage = ({ searchParams }: { searchParams: { [key: string]: string } }) => (
  <div>
    <Suspense key={JSON.stringify(searchParams)} fallback={<MarketplaceListLoading />}>
      <MarketplaceList params={searchParams} />
    </Suspense>
  </div>
);

export default MarketPlacePage;
