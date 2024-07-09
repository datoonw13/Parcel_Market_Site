import { FC } from "react";
import { getUserReceivedOffers } from "@/server-actions/user/received-offers-actions";
import { ReceivedOffersFilters } from "@/types/offer";
import DataNotFound from "@/components/@new/shared/DataNotFound";
import OfferBox from "@/components/@new/offer/offer-box.tsx/OfferBox";

interface ReceivedOffersListProps {
  params: ReceivedOffersFilters;
}

const ReceivedOffersList: FC<ReceivedOffersListProps> = async ({ params }) => {
  const data = await getUserReceivedOffers(params);

  return (
    <div className="flex flex-col gap-6 md:gap-4">
      {(!data || data.data.length === 0) && <DataNotFound message="No received offers yet" />}
      {data?.data.map((offer) => (
        <OfferBox key={offer.id} data={offer} />
      ))}
    </div>
  );
};

export default ReceivedOffersList;
