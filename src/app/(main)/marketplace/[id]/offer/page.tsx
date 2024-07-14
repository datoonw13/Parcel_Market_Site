"use client";

import { ArrowIconLeft1 } from "@/components/@new/icons/ArrowIcons";
import CreateOffer from "@/components/@new/marketplace/offer/create-offer";
import Container from "@/components/@new/shared/Container";
import Button from "@/components/@new/shared/forms/Button";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const CreateOfferPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const pathname = usePathname();

  const goBack = () => {
    const path = pathname.split("/");
    router.push(path.slice(0, path.length - 1).join("/"));
  };

  return (
    <Container className="py-6 px-5 pb-20">
      <div>
        <Button variant="secondary" className="!p-0 !h-fit !outline-none" onClick={goBack}>
          <div className="flex items-center gap-2 text-primary-main">
            <ArrowIconLeft1 className="!w-1.5 !h-3" color="primary-main" /> Back
          </div>
        </Button>
        <p className="text-lg font-semibold my-6">Make an offer</p>
      </div>
      <div className="font-semibold mt-4 mb-6 border border-grey-100 rounded-2xl pt-4 md:pt-8">
        <CreateOffer sellingPropertyId={Number(params.id)} goBack={goBack} />
      </div>
    </Container>
  );
};

export default CreateOfferPage;
