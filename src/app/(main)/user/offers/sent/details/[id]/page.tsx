import SentOfferDetails from "@/components/@new/user/offers/sent/sent-offer-details";
import routes from "@/helpers/routes";
import { getOfferAction } from "@/server-actions/offer/actions";
import { redirect } from "next/navigation";

const SentOfferDetailsPage = async ({ params }: { params: { id: string } }) => {
  const { data } = await getOfferAction(params.id);

  if (!data) {
    redirect(routes.user.offers.sent.fullUrl);
  }

  return <SentOfferDetails data={data} />;
};

export default SentOfferDetailsPage;
