import { getReceivedOffersAction } from "@/server-actions/offer/actions";
import { ReceivedOffersFilters } from "@/types/offer";
import { FC } from "react";
import ReceivedOffersPagination from "./pagination";
import ReceivedOffersList from "./list";

interface ReceivedOffersListWrapperProps {
  params: ReceivedOffersFilters & { showOfferDetail?: string };
}

const ReceivedOffersListWrapper: FC<ReceivedOffersListWrapperProps> = async ({ params }) => {
  const { data } = await getReceivedOffersAction(params);

  return (
    <div>
      {data && <ReceivedOffersList data={data.list} totalCount={data.pagination.totalCount} />}
      <ReceivedOffersPagination
        page={Number(params.page)}
        pageSize={Number(params.pageSize)}
        totalCount={data?.pagination.totalCount || 0}
      />
    </div>
  );
};

export default ReceivedOffersListWrapper;
