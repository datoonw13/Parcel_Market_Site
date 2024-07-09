import OfferBox from "@/components/@new/offer/offer-box.tsx/OfferBox";
import UserProfileSectionHeader from "@/components/@new/user/UserProfileSectionHeader";
import { SortEnum } from "@/types/common";
import { FC, Suspense } from "react";
import Sort from "@/components/@new/shared/filters/Sort";
import { ReceivedOffersFilters } from "@/types/offer";
import UserReceivedOffersFilters from "./components/UserReceivedOffersFilters";
import ReceivedOffersList from "./components/ReceivedOffersList";
import ReceivedOffersListLoading from "./components/ReceivedOffersListLoading";

interface ReceivedOffersListProps {
  searchParams: ReceivedOffersFilters;
}

const UserReceivedOffers: FC<ReceivedOffersListProps> = async ({ searchParams }) => {
  const params = {
    ...searchParams,
    page: searchParams?.page ? searchParams?.page : "1",
    pageSize: searchParams?.pageSize ? searchParams?.pageSize : "10",
  };

  return (
    <div className="">
      <UserProfileSectionHeader title="Received Offers" description="View and assess the proposals you've received for your property." />
      <Suspense>
        <UserReceivedOffersFilters />
      </Suspense>
      <div className="mb-6 md:mb-4">
        <Sort options={SortEnum} />
      </div>
      <Suspense fallback={<ReceivedOffersListLoading />}>
        <ReceivedOffersList params={params} />
        <p>qwd</p>
      </Suspense>
    </div>
  );
};

export default UserReceivedOffers;
