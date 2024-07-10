import { FC } from "react";
import { getUserReceivedOffers } from "@/server-actions/user/received-offers-actions";
import { ReceivedOfferModel, ReceivedOffersFilters } from "@/types/offer";
import DataNotFound from "@/components/@new/shared/DataNotFound";
import ReceivedOffersListPagination from "./pagination";
import ReceivedOfferBox from "./offer-box/offer-box";

interface ReceivedOffersListProps {
  data: ReceivedOfferModel[];
}

const ReceivedOffersList: FC<ReceivedOffersListProps> = async ({ data }) => (
  <div className="flex flex-col gap-6 md:gap-4">
    {data.length === 0 && <DataNotFound message="No received offers yet" />}
    {data.map((offer) => (
      <ReceivedOfferBox key={offer.id} data={offer} selecting />
    ))}
  </div>
);

export default ReceivedOffersList;
