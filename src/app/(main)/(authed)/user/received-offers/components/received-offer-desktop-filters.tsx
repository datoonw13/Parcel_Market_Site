"use client";

import MinMaxDesktopFilters from "@/components/@new/shared/filters/desktop/MinMaxDesktopFilters";
import AutoCompleteDesktopFilters from "@/components/@new/shared/filters/desktop/AutoCompleteDesktopFilters";
import { getMinMaxFilterLabel, priceFilters } from "@/components/@new/shared/filters/filters-utils";
import { OfferStatusEnum } from "@/types/offer";

const UserReceivedOffersDesktopFilters = () => (
  <div className="gap-3 mb-6 hidden sm:flex">
    <AutoCompleteDesktopFilters filterKey="parcelNumber" placeholder="Parcel ID" options={[]} />
    <AutoCompleteDesktopFilters
      filterKey="status"
      placeholder="Status"
      options={Object.keys(OfferStatusEnum).map((key) => ({
        value: OfferStatusEnum[key as keyof typeof OfferStatusEnum],
        label: OfferStatusEnum[key as keyof typeof OfferStatusEnum],
      }))}
    />
    <MinMaxDesktopFilters
      filterKey="offerPrice"
      options={priceFilters}
      placeHolder="Offer Price"
      getOptionLabel={(item) => getMinMaxFilterLabel(item.min, item.max)}
    />
    <MinMaxDesktopFilters
      filterKey="voltPrice"
      options={priceFilters}
      placeHolder="VOLT Price"
      getOptionLabel={(item) => getMinMaxFilterLabel(item.min, item.max)}
    />
  </div>
);

export default UserReceivedOffersDesktopFilters;
