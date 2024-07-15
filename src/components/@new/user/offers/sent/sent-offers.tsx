import DataNotFound from "@/components/@new/shared/DataNotFound";
import { getSentOffersAction } from "@/server-actions/offer/actions";
import SentOffersHeader from "./sent-offers-header";
import SentOffersPagination from "./sent-offers-pagination";
import SentOfferItem from "./sent-offer-item";

const PAGE_SIZE = 6;

const SentOffers = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  const { data } = await getSentOffersAction({ ...searchParams, pageSize: PAGE_SIZE.toString() });

  return (
    <div className="space-y-8 md:space-y-6">
      {!data || data.pagination.totalCount === 0 ? (
        <DataNotFound message="No sent offers" />
      ) : (
        <>
          <SentOffersHeader totalCount={data.pagination.totalCount} />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {data.list.map((offer) => (
              <SentOfferItem data={offer} key={offer.id} />
            ))}
          </div>
          <SentOffersPagination totalCount={data.pagination.totalCount} pageSize={PAGE_SIZE} />
        </>
      )}
    </div>
  );
};

export default SentOffers;
