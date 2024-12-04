import { Suspense } from "react";
import UserProfileSectionHeader from "@/components/@new/user/UserSectionHeading";
import ReceivedOffersDesktopFilters from "@/components/@new/user/offers/received/received-offer-desktop-filters";
import ReceivedOffers from "@/components/@new/user/offers/received/received-offers";
import ReceivedOfferListLoading from "@/components/@new/user/offers/received/received-offers-loading";
import { getUserAction } from "@/server-actions/user/actions";
import SubscribeError from "@/components/@new/shared/subscribe-error";
import OfferDetailModal from "@/components/@new/user/offers/details/offer-detail-modal";
import ReceivedOfferDetailWrapper from "@/components/@new/user/offers/received/received-offer-details-wrapper";

const ReceivedOffersPage = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  const user = await getUserAction();
  const { offerId, ...params } = searchParams;

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between flex-col sm:flex-row gap-6">
        <UserProfileSectionHeader title="Received Offers" description="View and assess the proposals you've received for your property." />
      </div>
      {user?.isSubscribed ? (
        <>
          {searchParams.offerId && (
            <OfferDetailModal>
              <Suspense>
                <ReceivedOfferDetailWrapper offerId={searchParams.offerId} />
              </Suspense>
            </OfferDetailModal>
          )}
          <Suspense>
            <div className="hidden sm:block">
              <ReceivedOffersDesktopFilters />
            </div>
          </Suspense>
          <Suspense fallback={<ReceivedOfferListLoading />} key={JSON.stringify(params)}>
            <ReceivedOffers searchParams={params} />
          </Suspense>
        </>
      ) : (
        <SubscribeError />
      )}
    </div>
  );
};

export default ReceivedOffersPage;
