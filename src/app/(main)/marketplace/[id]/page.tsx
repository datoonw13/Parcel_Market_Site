import LandLoading from "@/components/@new/marketplace/land/land-loading";
import Container from "@/components/@new/shared/Container";
import React, { Suspense } from "react";
import routes from "@/helpers/routes";
import Land from "@/components/@new/marketplace/land/land";
import LandDetailsBreadcrumb from "@/components/@new/marketplace/land/breadcrumb";
import { redirect } from "next/navigation";

const LandDetailsPage = ({ params }: { params: { id: string } }) => {
  if (!params.id) {
    redirect(routes.marketplace.fullUrl);
  }
  return (
    <Container className="pt-6 md:pt-8 pb-20 sm:pb-24 md:pb-32 lg:pb-36">
      <Suspense>
        <LandDetailsBreadcrumb sellingPropertyId={params.id} />
      </Suspense>
      <Suspense fallback={<LandLoading />}>
        <Land sellingPropertyId={params.id} />
      </Suspense>
    </Container>
  );
};

export default LandDetailsPage;
