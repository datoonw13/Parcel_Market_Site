import DataNotFound from "@/components/@new/shared/DataNotFound";
import { getReceivedOffersAction } from "@/server-actions/offer/actions";
import ReceivedOffersHeader from "./received-offers-header";
import ReceivedOfferPagination from "./received-offers-pagination";
import ReceivedOfferItem from "./received-offer-item";

const PAGE_SIZE = 6;

const ReceivedOffers = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  const { data } = await getReceivedOffersAction({ ...searchParams, pageSize: PAGE_SIZE.toString() });

  return (
    <>
      <div className="space-y-8 md:space-y-6">
        {!data || data.pagination.totalCount === 0 ? (
          <DataNotFound message="No received offers" />
        ) : (
          <>
            <ReceivedOffersHeader totalCount={data.pagination.totalCount} />
            <div className="grid grid-cols-1 gap-6">
              {data.list.map((offer) => (
                <ReceivedOfferItem data={offer} key={offer.id} />
              ))}
            </div>
            <ReceivedOfferPagination totalCount={data.pagination.totalCount} pageSize={PAGE_SIZE} />
          </>
        )}
      </div>
    </>
  );
};

export default ReceivedOffers;
