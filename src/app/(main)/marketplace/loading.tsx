import MarketplaceListLoading from "@/components/@new/marketplace/list/marketplace-list-loading";
import Container from "@/components/@new/shared/Container";
import React from "react";

const MarketPlaceLoading = () => (
  <Container className="py-6 md:py-8">
    <div className="space-y-10 md:space-y-8">
      <div className="rounded-2xl animate-pulse bg-primary-main-100 h-9" />
      <div className="rounded-2xl animate-pulse bg-primary-main-100 h-9" />
      <div className="rounded-2xl animate-pulse bg-primary-main-100 h-9" />
    </div>
    <MarketplaceListLoading />
  </Container>
);

export default MarketPlaceLoading;
