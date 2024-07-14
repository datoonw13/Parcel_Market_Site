import { ArrowIconLeftFilled1 } from "@/components/@new/icons/ArrowIcons";
import MarketplaceHeader from "@/components/@new/marketplace/list/marketplace-header";
import Container from "@/components/@new/shared/Container";
import React from "react";

const LandDetailsPage = () => (
  <Container className="py-6 md:py-8">
    <div className="flex items-center gap-1.5 cursor-pointer mb-8 md:mb-10">
      <p className="text-sm text-grey-800">Homepage</p>
      <div className="w-5 h-5 flex items-center justify-center">
        <ArrowIconLeftFilled1 className="!w-1.5 h-1.5" color="primary-main" />
      </div>
      <p className="text-sm text-grey-800">Lands Marketplace</p>
      <div className="w-5 h-5 flex items-center justify-center">
        <ArrowIconLeftFilled1 className="!w-1.5 h-1.5" color="primary-main" />
      </div>
      <p className="text-sm text-primary-main font-medium">Land name</p>
    </div>
    <div>ae</div>
  </Container>
);

export default LandDetailsPage;
