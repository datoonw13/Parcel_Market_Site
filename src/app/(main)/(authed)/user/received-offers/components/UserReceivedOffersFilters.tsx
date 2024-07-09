"use client";

import MinMaxDesktopFilters from "@/components/@new/shared/filters/desktop/MinMaxDesktopFilters";
import AutoCompleteDesktopFilters from "@/components/@new/shared/filters/desktop/AutoCompleteDesktopFilters";
import { getMinMaxFilterLabel, priceFilters } from "@/components/@new/shared/filters/filters-utils";
import { OfferStatus } from "@/types/offer";

const UserReceivedOffersFilters = () => (
  <div className="flex gap-3 mb-6">
    <AutoCompleteDesktopFilters filterKey="parcelNumber" placeholder="Parcel ID" options={[]} />
    <AutoCompleteDesktopFilters
      filterKey="status"
      placeholder="Status"
      options={Object.keys(OfferStatus).map((key) => ({
        value: OfferStatus[key as keyof typeof OfferStatus],
        label: OfferStatus[key as keyof typeof OfferStatus],
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

export default UserReceivedOffersFilters;
