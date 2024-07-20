import { ArrowIconLeftFilled1 } from "@/components/@new/icons/ArrowIcons";
import LandLoading from "@/components/@new/marketplace/land/land-loading";
import Container from "@/components/@new/shared/Container";
import React, { Suspense } from "react";
import Link from "next/link";
import routes from "@/helpers/routes";
import Land from "@/components/@new/marketplace/land/land";

const LandDetailsPage = ({ params }: { params: { id: string } }) => (
  <Container className="pt-6 md:pt-8 pb-20 sm:pb-24 md:pb-32 lg:pb-36">
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
    <Suspense fallback={<LandLoading />}>
      <Land landId={params.id} />
    </Suspense>
  </Container>
);

export default LandDetailsPage;
