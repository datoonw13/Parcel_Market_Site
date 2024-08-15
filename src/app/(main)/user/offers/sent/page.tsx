import SubscribeError from "@/components/@new/shared/subscribe-error";
import UserProfileSectionHeader from "@/components/@new/user/UserProfileSectionHeader";
import OfferDetailModal from "@/components/@new/user/offers/details/offer-detail-modal";
import SentOfferDetailsWrapper from "@/components/@new/user/offers/sent/sent-offer-details-wrapper";
import SentOffers from "@/components/@new/user/offers/sent/sent-offers";
import SentOffersDesktopFilter from "@/components/@new/user/offers/sent/sent-offers-desktop-filters";
import SentOffersLoading from "@/components/@new/user/offers/sent/sent-offers-loading";
import { getUserAction } from "@/server-actions/user/actions";
import { Suspense } from "react";

const SentOffersPage = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  const user = await getUserAction();
  const { offerId, ...params } = searchParams;

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between flex-col sm:flex-row gap-6">
        <UserProfileSectionHeader title="Sent Offers" description="View and manage the offers you've sent for future consideration." />
      </div>
      {user?.isSubscribed ? (
        <>
          {searchParams.offerId && (
            <OfferDetailModal>
              <Suspense>
                <SentOfferDetailsWrapper offerId={searchParams.offerId} />
              </Suspense>
            </OfferDetailModal>
          )}
          <Suspense>
            <div className="hidden sm:block">
              <SentOffersDesktopFilter />
            </div>
          </Suspense>
          <Suspense fallback={<SentOffersLoading />} key={JSON.stringify(params)}>
            <SentOffers searchParams={params} />
          </Suspense>
        </>
      ) : (
        <SubscribeError />
      )}
    </div>
  );
};

export default SentOffersPage;
