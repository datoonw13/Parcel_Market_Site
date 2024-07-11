import React from "react";
import { getOfferDetail } from "@/server-actions/user/received-offers-actions";
import routes from "@/helpers/routes";
import { redirect } from "next/navigation";
import ReceivedOfferDetailsHeader from "./components/header";

const ReceivedOfferDetails = async ({ params }: { params: { offerId: string } }) => {
  const data = await getOfferDetail(params.offerId);

  if (!data) {
    redirect(routes.user.offers.received.fullUrl);
  }

  return (
    <div>
      <ReceivedOfferDetailsHeader />
      {/* {data && <ReceivedOfferFullDetail data={data} />} */}
    </div>
  );
};
export default ReceivedOfferDetails;
