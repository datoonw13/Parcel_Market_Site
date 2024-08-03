import { Suspense } from "react";
import UserProfileSectionHeader from "@/components/@new/user/UserProfileSectionHeader";
import ReceivedOffersDesktopFilters from "@/components/@new/user/offers/received/received-offer-desktop-filters";
import ReceivedOffers from "@/components/@new/user/offers/received/received-offers";
import ReceivedOfferListLoading from "@/components/@new/user/offers/received/received-offers-loading";
import { getUserAction } from "@/server-actions/user/actions";
import SubscribeError from "@/components/@new/shared/subscribe-error";

const ReceivedOffersPage = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  const user = await getUserAction();

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between flex-col sm:flex-row gap-6">
        <UserProfileSectionHeader title="Received Offers" description="View and assess the proposals you've received for your property." />
      </div>
      {user?.isSubscribed ? (
        <>
          <Suspense>
            <div className="hidden sm:block">
              <ReceivedOffersDesktopFilters />
            </div>
          </Suspense>
          <Suspense fallback={<ReceivedOfferListLoading />} key={JSON.stringify(searchParams)}>
            <ReceivedOffers searchParams={searchParams} />
          </Suspense>
        </>
      ) : (
        <SubscribeError />
      )}
    </div>
  );
};

export default ReceivedOffersPage;
