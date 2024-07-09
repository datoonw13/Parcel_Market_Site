"use client";

import { priceFilters, getMinMaxFilterLabel } from "@/components/@new/shared/filters/filters-utils";
import FiltersDrawer from "@/components/@new/shared/filters/mobile/FiltersDrawer";
import { OfferStatusEnum } from "@/types/offer";

const filters = {
  status: {
    label: "Status",
    type: "default" as const,
    options: Object.values(OfferStatusEnum).map((value) => ({ label: value, value })),
  },
  parcelNumber: {
    label: "Parcel ID",
    type: "default" as const,
    options: [{ label: "1345567", value: "124234324" }],
  },
  offerPrice: {
    label: "Offer Price",
    type: "minmax" as const,
    renderLabel: getMinMaxFilterLabel,
    options: priceFilters,
  },
  voltPrice: {
    label: "VOLT Price",
    type: "minmax" as const,
    renderLabel: getMinMaxFilterLabel,
    options: priceFilters,
  },
};

const UserReceivedOffersMobileFilters = () => <FiltersDrawer data={filters} />;

export default UserReceivedOffersMobileFilters;
