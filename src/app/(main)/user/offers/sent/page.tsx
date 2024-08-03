import UserProfileSectionHeader from "@/components/@new/user/UserProfileSectionHeader";
import SentOffers from "@/components/@new/user/offers/sent/sent-offers";
import SentOffersDesktopFilter from "@/components/@new/user/offers/sent/sent-offers-desktop-filters";
import SentOffersLoading from "@/components/@new/user/offers/sent/sent-offers-loading";
import { getUserAction } from "@/server-actions/user/actions";
import { Suspense } from "react";

const SentOffersPage = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  const user = await getUserAction();

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between flex-col sm:flex-row gap-6">
        <UserProfileSectionHeader title="Sent Offers" description="View and manage the offers you've sent for future consideration." />
      </div>
      <Suspense>
        <div className="hidden sm:block">
          <SentOffersDesktopFilter />
        </div>
      </Suspense>
      <Suspense fallback={<SentOffersLoading />} key={JSON.stringify(searchParams)}>
        <SentOffers searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default SentOffersPage;
