import ReceivedOfferDetails from "@/components/@new/user/offers/received/received-offer-details";
import routes from "@/helpers/routes";
import { getOfferAction } from "@/server-actions/offer/actions";
import { redirect } from "next/navigation";

const ReceivedOfferDetailsPage = async ({ params }: { params: { id: string } }) => {
  const { data } = await getOfferAction(params.id);

  if (!data) {
    redirect(routes.user.offers.received.fullUrl);
  }

  return <ReceivedOfferDetails data={data} className="!p-0" />;
};

export default ReceivedOfferDetailsPage;
