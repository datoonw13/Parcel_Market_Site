import { ArrowIconLeft1 } from "@/components/@new/icons/ArrowIcons";
import Button from "@/components/@new/shared/forms/Button";
import React from "react";
import { getOfferDetail } from "@/server-actions/user/received-offers-actions";
import routes from "@/helpers/routes";
import { redirect } from "next/navigation";
import ReceivedOfferDetailHeader from "./components/received-offer-detail-header";
import ReceivedOfferFullDetail from "../components/received-offer-full-detail/received-offer-full-detail";

const ReceivedOfferDetails = async ({ params }: { params: { offerId: string } }) => {
  const data = await getOfferDetail(params.offerId);

  if (!data) {
    redirect(routes.user.offers.received.fullUrl);
  }

  return (
    <div>
      <ReceivedOfferDetailHeader />
      {data && <ReceivedOfferFullDetail data={data} />}
    </div>
  );
};
export default ReceivedOfferDetails;
