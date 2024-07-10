"use client";

import { Suspense } from "react";
import Button from "@/components/@new/shared/forms/Button";
import Sort from "@/components/@new/shared/filters/Sort";
import { SortEnum } from "@/types/common";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import UserReceivedOffersMobileFilters from "./received-offer-mobile-filters";
import UserReceivedOffersDesktopFilters from "./received-offer-desktop-filters";
import ReceivedOfferListWrapper from "./list-wrapper";
import ReceivedOffersListLoading from "./received-offer-loading";

const ReceivedOffers = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const handleSelect = () => {
    console.log("aqa");

    params.set(`selecting`, "true");
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <>
      <Suspense>
        <UserReceivedOffersDesktopFilters />
      </Suspense>
      <div className="mb-6 md:mb-4 flex items-center justify-between w-full">
        <div className="block sm:hidden">
          <UserReceivedOffersMobileFilters />
        </div>
        <div className="flex items-center gap-3 sm:justify-between sm:w-full">
          <Button
            onClick={handleSelect}
            className="!py-1 !px-3 !bg-grey-50 !outline-none !rounded-3xl text-xs !text-black"
            variant="secondary"
          >
            Selectaa
          </Button>
          <div className="flex items-center gap-3">
            <p className="hidden sm:block text-grey-600 text-xs">1326111,000 Lands</p>
            <Sort options={SortEnum} />
          </div>
        </div>
      </div>
      <Suspense key={JSON.stringify(params)} fallback={<ReceivedOffersListLoading />}>
        {/* <ReceivedOfferListWrapper params={params} /> */}
      </Suspense>
    </>
  );
};

export default ReceivedOffers;
