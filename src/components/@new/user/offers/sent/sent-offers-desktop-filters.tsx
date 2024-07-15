"use client";

import MinMaxDesktopFilters from "@/components/@new/shared/filters/desktop/MinMaxDesktopFilters";
import AutoCompleteDesktopFilters from "@/components/@new/shared/filters/desktop/AutoCompleteDesktopFilters";
import { getMinMaxFilterLabel, priceFilters } from "@/components/@new/shared/filters/filters-utils";
import { OfferStatusEnum } from "@/types/offer";
import { useEffect, useState } from "react";
import { getReceivedOffersParcelNumbersAction } from "@/server-actions/offer/actions";
import { getAllStates, getCounties } from "@/helpers/states";
import { acreagesFilters, getAcreageLabel } from "../../../lands/filters/lands-filters-utils";

const SentOffersDesktopFilter = () => {
  const [parcelNumbers, setParcelNumbers] = useState<{ value: string; label: string }[] | null>(null);

  const getParcelNumbers = async () => {
    const { data } = await getReceivedOffersParcelNumbersAction();
    if (data) {
      setParcelNumbers(data.map((el) => ({ value: el, label: el })));
    }
  };

  useEffect(() => {
    getParcelNumbers();
  }, []);

  return (
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
        filterKey="offeredPrice"
        options={priceFilters}
        placeHolder="Offered Price"
        getOptionLabel={(item) => getMinMaxFilterLabel(item.min, item.max)}
      />
      <AutoCompleteDesktopFilters
        filterKey="status"
        placeholder="Status"
        options={Object.keys(OfferStatusEnum).map((key) => ({
          value: OfferStatusEnum[key as keyof typeof OfferStatusEnum],
          label: OfferStatusEnum[key as keyof typeof OfferStatusEnum],
        }))}
      />
    </div>
  );
};

export default SentOffersDesktopFilter;
