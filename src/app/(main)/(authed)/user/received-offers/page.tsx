import UserProfileSectionHeader from "@/components/@new/user/UserProfileSectionHeader";
import { SortEnum } from "@/types/common";
import { FC, Suspense } from "react";
import Sort from "@/components/@new/shared/filters/Sort";
import { ReceivedOffersFilters } from "@/types/offer";
import Button from "@/components/@new/shared/forms/Button";
import UserReceivedOffersDesktopFilters from "./components/UserReceivedOffersDesktopFilters";
import ReceivedOffersList from "./components/ReceivedOffersList";
import ReceivedOffersListLoading from "./components/ReceivedOffersListLoading";
import UserReceivedOffersMobileFilters from "./components/UserReceivedOffersMobileFilters";

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
    <div className="">
      <UserProfileSectionHeader title="Received Offers" description="View and assess the proposals you've received for your property." />
      <Suspense>
        <UserReceivedOffersDesktopFilters />
      </Suspense>
      <div className="mb-6 md:mb-4 flex items-center justify-between w-full">
        <div className="block sm:hidden">
          <UserReceivedOffersMobileFilters />
        </div>
        <div className="flex items-center gap-3 sm:justify-between sm:w-full">
          <Button className="!py-1 !px-3 !bg-grey-50 !outline-none !rounded-3xl text-xs !text-black" variant="secondary">
            Select
          </Button>
          <div className="flex items-center gap-3">
            <p className="hidden sm:block text-grey-600 text-xs">1326,000 Lands</p>
            <Sort options={SortEnum} />
          </div>
        </div>
      </div>
      <Suspense key={JSON.stringify(params)} fallback={<ReceivedOffersListLoading />}>
        <ReceivedOffersList params={params} />
      </Suspense>
    </div>
  );
};

export default UserReceivedOffers;
