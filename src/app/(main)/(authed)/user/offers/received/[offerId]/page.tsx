import { getOfferDetailAction } from "@/server-actions/offer/actions";
import routes from "@/helpers/routes";
import { redirect } from "next/navigation";
import ReceivedOfferDetailsHeader from "./components/header";
import OfferFullDetail from "../../components/offer-full-detail/received-offer-full-detail";

const ReceivedOfferDetails = async ({ params }: { params: { offerId: string } }) => {
  const { data } = await getOfferDetailAction(params.offerId);

  if (!data) {
    redirect(routes.user.offers.received.fullUrl);
  }

  return (
    <div>
      <ReceivedOfferDetailsHeader />
      {data && <OfferFullDetail data={data} responsive />}
    </div>
  );
};
export default ReceivedOfferDetails;
