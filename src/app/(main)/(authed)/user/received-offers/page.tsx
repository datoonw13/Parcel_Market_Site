"use client";

import OfferBox from "@/components/@new/offer/offer-box.tsx/OfferBox";
import UserProfileSectionHeader from "@/components/@new/user/UserProfileSectionHeader";
import { SortEnum } from "@/types/common";
import { Suspense } from "react";
import UserReceivedOffersFilters from "./components/UserReceivedOffersFilters";
import Sort from "@/components/@new/shared/filters/Sort";

const UserReceivedOffers = () => (
  <div className="">
    <UserProfileSectionHeader title="Received Offers" description="View and assess the proposals you've received for your property." />
    <Suspense>
      <UserReceivedOffersFilters />
    </Suspense>
    <div className="mb-6 md:mb-4">
      <Sort options={SortEnum} />
    </div>
    <OfferBox />
  </div>
);

export default UserReceivedOffers;
