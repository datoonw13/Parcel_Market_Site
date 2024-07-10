import { getUserReceivedOffers } from "@/server-actions/user/received-offers-actions";
import { FC } from "react";
import { ReceivedOffersFilters } from "@/types/offer";
import ReceivedOffersList from "./list";
import ReceivedOffersListPagination from "./pagination";

interface ReceivedOffersListWrapperProps {
  params: ReceivedOffersFilters;
}

const ReceivedOfferListWrapper: FC<ReceivedOffersListWrapperProps> = async ({ params }) => {
  const data = await getUserReceivedOffers(params);

  return (
    <div>
      {data?.data && <ReceivedOffersList data={data.data} />}
      <ReceivedOffersListPagination
        page={Number(params.page)}
        pageSize={Number(params.pageSize)}
        totalCount={data?.pagination.totalCount || 0}
      />
    </div>
  );
};

export default ReceivedOfferListWrapper;
