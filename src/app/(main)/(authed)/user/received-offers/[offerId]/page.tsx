import { ArrowIconLeft1 } from "@/components/@new/icons/ArrowIcons";
import Button from "@/components/@new/shared/forms/Button";
import React from "react";
import ReceivedOfferDetailHeader from "./components/received-offer-detail-header";

const ReceivedOfferDetails = () => (
  <div>
    <ReceivedOfferDetailHeader />
    <Button variant="secondary" className="!p-0 !h-fit !outline-none">
      <div className="flex items-center gap-2 text-primary-main">
        <ArrowIconLeft1 className="!w-1.5 !h-3" color="primary-main" /> Back
      </div>
    </Button>
    <div className="font-semibold mt-4 mb-6">Offer Details</div>
  </div>
);

export default ReceivedOfferDetails;
