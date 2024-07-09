import { FC } from "react";
import { getUserReceivedOffers } from "@/server-actions/user/received-offers-actions";
import { ReceivedOffersFilters } from "@/types/offer";
import DataNotFound from "@/components/@new/shared/DataNotFound";

interface ReceivedOffersListProps {
  params: ReceivedOffersFilters;
}

const ReceivedOffersList: FC<ReceivedOffersListProps> = async ({ params }) => {
  const data = await getUserReceivedOffers(params);

  return <div>{(!data || data.data.length === 0) && <DataNotFound message="No received offers yet" />}</div>;
};

export default ReceivedOffersList;
