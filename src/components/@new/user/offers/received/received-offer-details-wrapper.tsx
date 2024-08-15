import { getOfferAction } from "@/server-actions/offer/actions";
import React from "react";
import ReceivedOfferDetails from "./received-offer-details";

const ReceivedOfferDetailWrapper = async ({ offerId }: { offerId: string }) => {
  const { data } = await getOfferAction(offerId);

  return data && <ReceivedOfferDetails contentClassName="px-8 py-6" actionClassName="px-8 py-4" data={data} />;
};

export default ReceivedOfferDetailWrapper;
