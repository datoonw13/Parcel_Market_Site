"use client";

import { FC, Suspense } from "react";
import { ReceivedOfferModel } from "@/types/offer";
import DataNotFound from "@/components/@new/shared/DataNotFound";
import Sort from "@/components/@new/shared/filters/Sort";
import { SortEnum } from "@/types/common";
import Button from "@/components/@new/shared/forms/Button";
import ReceivedOfferBox from "./received-offer-box/received-offer-box";
import UserReceivedOffersMobileFilters from "./received-offer-mobile-filters";

interface ReceivedOffersListProps {
  data: ReceivedOfferModel[];
}

const ReceivedOffersList: FC<ReceivedOffersListProps> = ({ data }) => (
  <div className="space-y-6 md:space-y-4">
    <div className="flex items-center gap-3 sm:justify-between sm:w-full">
      <div className="block sm:hidden">
        <UserReceivedOffersMobileFilters />
      </div>
      <Button className="!py-1 !px-3 !bg-grey-50 !outline-none !rounded-3xl text-xs !text-black" variant="secondary">
        Select
      </Button>
      <div className="flex items-center gap-3 ml-auto">
        <p className="hidden sm:block text-grey-600 text-xs">1326,000 Lands</p>
        <Sort options={SortEnum} />
      </div>
    </div>
    {data.length === 0 && <DataNotFound message="No received offers yet" />}
    <div className="flex flex-col gap-6 md:gap-4">
      {data.map((offer) => (
        <ReceivedOfferBox key={offer.id} data={offer} />
      ))}
    </div>
  </div>
);

export default ReceivedOffersList;
