"use client";

import MinMaxDesktopFilters from "@/components/@new/shared/filters/desktop/MinMaxDesktopFilters";
import AutoCompleteDesktopFilters from "@/components/@new/shared/filters/desktop/AutoCompleteDesktopFilters";
import { getMinMaxFilterLabel, priceFilters } from "@/components/@new/shared/filters/filters-utils";
import { OfferStatusEnum } from "@/types/offer";
import { useEffect, useState } from "react";
import { getReceivedOffersParcelNumbersAction } from "@/server-actions/offer/actions";
import { getAllStates, getCounties } from "@/helpers/states";
import { acreagesFilters, getAcreageLabel } from "../../lands/filters/lands-filters-utils";

const UserListingDesktopFilter = () => (
  <div className="gap-3 mb-6 grid grid-cols-4">
    <AutoCompleteDesktopFilters
      filterKey="state"
      placeholder="State"
      options={getAllStates().map((state) => ({
        value: state.value,
        label: state.label,
      }))}
    />
    <AutoCompleteDesktopFilters filterKey="county" placeholder="County" options={[]} />
    <MinMaxDesktopFilters
      filterKey="acreage"
      options={acreagesFilters}
      placeHolder="Acreage"
      getOptionLabel={(item) => getAcreageLabel(item.min, item.max)}
    />
    <MinMaxDesktopFilters
      filterKey="voltPrice"
      options={priceFilters}
      placeHolder="VOLT Price"
      getOptionLabel={(item) => getMinMaxFilterLabel(item.min, item.max)}
    />
  </div>
);

export default UserListingDesktopFilter;
