"use client";

import React from "react";
import Button from "@/components/@new/shared/forms/Button";
import { ArrowIconLeft1 } from "@/components/@new/icons/ArrowIcons";
import { usePathname, useRouter } from "next/navigation";
import CreateOffer from "../../components/create-offer";

const RequestOfferPage = ({ params }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="py-6 px-5 pb-20">
      <div>
        <Button variant="secondary" className="!p-0 !h-fit !outline-none" onClick={() => router.push(pathname.replace("offer", ""))}>
          <div className="flex items-center gap-2 text-primary-main">
            <ArrowIconLeft1 className="!w-1.5 !h-3" color="primary-main" /> Back
          </div>
        </Button>
        <div className="font-semibold mt-4 mb-6">Make An Offer</div>
      </div>
      <CreateOffer sellingPropertyId={params.slug} />
    </div>
  );
};

export default RequestOfferPage;
