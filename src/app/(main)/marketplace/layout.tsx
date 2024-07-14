import { ReactNode } from "react";
import MarketplaceHeader from "@/components/@new/marketplace/marketplace-header";
import Container from "@/components/@new/shared/Container";
import MarketPlaceFilters from "@/components/@new/marketplace/marketplace-filter";

const MarketPlaceLayout = ({ children }: { children: ReactNode }) => (
  <Container className="py-6 md:py-8">
    <MarketplaceHeader />
    <MarketPlaceFilters />
    <div>{children}</div>
  </Container>
);

export default MarketPlaceLayout;
