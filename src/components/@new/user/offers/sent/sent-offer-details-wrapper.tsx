import { getOfferAction } from "@/server-actions/offer/actions";
import React from "react";
import SentOfferDetails from "./sent-offer-details";

const SentOfferDetailsWrapper = async ({ offerId }: { offerId: string }) => {
  const { data } = await getOfferAction(offerId);

  return data && <SentOfferDetails contentClassName="px-8 py-6" actionClassName="px-8 py-4" data={data} />;
};

export default SentOfferDetailsWrapper;
