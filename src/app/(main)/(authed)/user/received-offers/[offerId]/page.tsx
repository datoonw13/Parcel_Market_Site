import { ArrowIconLeft1 } from "@/components/@new/icons/ArrowIcons";
import Button from "@/components/@new/shared/forms/Button";
import React from "react";
import { getUserReceivedOfferDetails } from "@/server-actions/user/received-offers-actions";
import routes from "@/helpers/routes";
import { redirect } from "next/navigation";
import ReceivedOfferDetailHeader from "./components/received-offer-detail-header";
import ReceivedOfferFullDetail from "../components/received-offer-full-detail";

const ReceivedOfferDetails = async ({ params }: { params: { offerId: string } }) => {
  const data = await getUserReceivedOfferDetails(params.offerId);

  if (!data) {
    redirect(routes.user.receivedOffers.fullUrl);
  }

  return (
    <div>
      <ReceivedOfferDetailHeader />
      {data && <ReceivedOfferFullDetail data={data?.data} />}
    </div>
  );
};
export default ReceivedOfferDetails;
