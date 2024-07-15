import { ArrowIconLeft1 } from "@/components/@new/icons/ArrowIcons";
import Container from "@/components/@new/shared/Container";
import Button from "@/components/@new/shared/forms/Button";
import routes from "@/helpers/routes";
import { OfferModel } from "@/types/offer";
import Link from "next/link";
import React from "react";
import OfferDetail from "../details/offer-detail";

const SentOfferDetails = ({ data }: { data: OfferModel }) => (
  <Container className="py-6 px-5 pb-20">
    <div>
      <Link href={routes.user.offers.sent.fullUrl}>
        <Button variant="secondary" className="!p-0 !h-fit !outline-none">
          <div className="flex items-center gap-2 text-primary-main">
            <ArrowIconLeft1 className="!w-1.5 !h-3" color="primary-main" /> Back
          </div>
        </Button>
      </Link>
      <p className="text-lg font-semibold my-6">Make an offer</p>
    </div>
    <div className="font-semibold mt-4 mb-6 border border-grey-100 rounded-2xl pt-4 md:pt-8">
      {/* <CreateOffer sellingPropertyId={Number(params.id)} goBack={goBack} /> */}
      <OfferDetail data={data} />
    </div>
  </Container>
);

export default SentOfferDetails;
