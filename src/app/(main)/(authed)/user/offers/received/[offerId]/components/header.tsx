"use client";

import { ArrowIconLeft1 } from "@/components/@new/icons/ArrowIcons";
import Button from "@/components/@new/shared/forms/Button";
import routes from "@/helpers/routes";
import { useRouter } from "next/navigation";

const ReceivedOfferDetailsHeader = () => {
  const { push } = useRouter();
  return (
    <div>
      <Button variant="secondary" className="!p-0 !h-fit !outline-none" onClick={() => push(routes.user.receivedOffers.fullUrl)}>
        <div className="flex items-center gap-2 text-primary-main">
          <ArrowIconLeft1 className="!w-1.5 !h-3" color="primary-main" /> Back
        </div>
      </Button>
      <div className="font-semibold mt-4 mb-6">Offer Details</div>
    </div>
  );
};

export default ReceivedOfferDetailsHeader;
