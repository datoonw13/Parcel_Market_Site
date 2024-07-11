import { FC, Suspense } from "react";
import { ReceivedOffersFilters } from "@/types/offer";
import ReceivedOffersListWrapper from "./components/list-wrapper";
import ReceivedOfferListLoading from "./components/loading";
import UserProfileSectionHeader from "@/components/@new/user/UserProfileSectionHeader";
import ReceivedOffersDesktopFilters from "./components/filters/desktop-filters";


interface ReceivedOffersListProps {
  searchParams: ReceivedOffersFilters;
}

const UserReceivedOffers: FC<ReceivedOffersListProps> = async ({ searchParams }) => {
  const params = {
    ...searchParams,
    page: searchParams?.page ? searchParams?.page : 1,
    pageSize: searchParams?.pageSize ? searchParams?.pageSize : 5,
  };

  return (
    <div>
      <UserProfileSectionHeader title="Received Offers" description="View and assess the proposals you've received for your property." />
      <Suspense>
          <div className="hidden sm:block">
            <ReceivedOffersDesktopFilters />
          </div>
        </Suspense>
      <Suspense key={JSON.stringify(params)} fallback={<ReceivedOfferListLoading />}>
          <ReceivedOffersListWrapper params={params} />
        </Suspense>
    </div>
  );
};

export default UserReceivedOffers;
