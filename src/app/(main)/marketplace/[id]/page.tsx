import { ArrowIconLeftFilled1 } from "@/components/@new/icons/ArrowIcons";
import LandDetailsWrapper from "@/components/@new/marketplace/details/land-details-wrapper";
import LandDetailsLoading from "@/components/@new/marketplace/details/land-details-loading";
import Container from "@/components/@new/shared/Container";
import React, { Suspense } from "react";
import Link from "next/link";
import routes from "@/helpers/routes";

const LandDetailsPage = ({ params }: { params: { id: string } }) => (
  <Container className="py-6 md:py-8">
    <div className="flex items-center gap-1.5 cursor-pointer mb-8 md:mb-10">
      <p className="text-sm text-grey-800">Homepage</p>
      <div className="w-5 h-5 flex items-center justify-center">
        <ArrowIconLeftFilled1 className="!w-1.5 h-1.5" color="primary-main" />
      </div>
      <Link href={routes.marketplace.fullUrl}>
        <p className="text-sm text-grey-800 cursor-pointer">Lands Marketplace</p>
      </Link>
      <div className="w-5 h-5 flex items-center justify-center">
        <ArrowIconLeftFilled1 className="!w-1.5 h-1.5" color="primary-main" />
      </div>
      <p className="text-sm text-primary-main font-medium">Land name</p>
    </div>
    <div>
      <Suspense fallback={<LandDetailsLoading />}>
        <LandDetailsWrapper landId={params.id} />
      </Suspense>
    </div>
  </Container>
);

export default LandDetailsPage;
