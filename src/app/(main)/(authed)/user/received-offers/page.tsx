"use client";

import OfferBox from "@/components/@new/offer/offer-box.tsx/OfferBox";
import UserReceivedOffersFilters from "./components/UserReceivedOffersFilters";

const UserReceivedOffers = () => (
  <div className="space-y-6">
    <UserReceivedOffersFilters />
    <OfferBox />
  </div>
);

export default UserReceivedOffers;
