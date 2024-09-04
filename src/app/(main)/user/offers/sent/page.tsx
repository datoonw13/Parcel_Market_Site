import SubscribeError from "@/components/@new/shared/subscribe-error";
import UserProfileSectionHeader from "@/components/@new/user/UserProfileSectionHeader";
import OfferDetailModal from "@/components/@new/user/offers/details/offer-detail-modal";
import SentOfferDetailsWrapper from "@/components/@new/user/offers/sent/sent-offer-details-wrapper";
import SentOffers from "@/components/@new/user/offers/sent/sent-offers";
import SentOffersDesktopFilter from "@/components/@new/user/offers/sent/sent-offers-desktop-filters";
import SentOffersLoading from "@/components/@new/user/offers/sent/sent-offers-loading";
import { getSentOffersAction } from "@/server-actions/offer/actions";
import { getUserAction } from "@/server-actions/user/actions";
import { Suspense } from "react";

const PAGE_SIZE = 6;

const SentOffersPage = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  const user = await getUserAction();
  const { data } = await getSentOffersAction(6);
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
            <SentOffers pageSize={PAGE_SIZE} searchParams={params} totalCount={data?.pagination.totalCount || 0} />
          </Suspense>
        </>
      ) : (
        <SubscribeError />
      )}
    </div>
  );
};

export default SentOffersPage;
