"use client";

import OfferBox from "@/components/@new/offer/offer-box.tsx/OfferBox";
import UserProfileSectionHeader from "@/components/@new/user/UserProfileSectionHeader";
import UserReceivedOffersFilters from "./components/UserReceivedOffersFilters";

const UserReceivedOffers = () => (
  <div className="">
    <UserProfileSectionHeader title="Received Offers" description="View and assess the proposals you've received for your property." />
    <UserReceivedOffersFilters />
    <OfferBox />
  </div>
);

export default UserReceivedOffers;
