import UserProfileSectionHeader from "@/components/@new/user/UserProfileSectionHeader";
import { FC, Suspense } from "react";
import { ReceivedOffersFilters } from "@/types/offer";
import ReceivedOfferListWrapper from "./components/received-offers-list/received-offer-list-wrapper";
import ReceivedOffersListLoading from "./components/received-offers-list/received-offer-loading";
import UserReceivedOffersDesktopFilters from "./components/received-offer-details-modal";

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
      <>
        <UserProfileSectionHeader title="Received Offers" description="View and assess the proposals you've received for your property." />
        <Suspense>
          <div className="hidden sm:block">
            <UserReceivedOffersDesktopFilters />
          </div>
        </Suspense>
        <Suspense key={JSON.stringify(params)} fallback={<ReceivedOffersListLoading />}>
          <ReceivedOfferListWrapper params={params} />
        </Suspense>
      </>
    </div>
  );
};

export default UserReceivedOffers;
