"use client";

import MinMaxDesktopFilters from "@/components/@new/shared/filters/desktop/MinMaxDesktopFilters";
import AutoCompleteDesktopFilters from "@/components/@new/shared/filters/desktop/AutoCompleteDesktopFilters";
import { getMinMaxFilterLabel, priceFilters } from "@/components/@new/shared/filters/filters-utils";
import { useEffect, useState } from "react";
import { getReceivedOffersParcelNumbersAction } from "@/server-actions/offer/actions";
import { getAllStates } from "@/helpers/states";
import { acreagesFilters, getAcreageLabel } from "../../lands/filters/lands-filters-utils";

const MarketPlaceDesktopFilters = ({ disabled }: { disabled: boolean }) => {
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
    <div className="gap-3 grid-cols-[120px_120px_120px_120px] hidden lg:grid">
      <AutoCompleteDesktopFilters
        disabled={disabled}
        filterKey="state"
        placeholder="State"
        options={getAllStates().map((state) => ({
          value: state.value,
          label: state.label,
        }))}
      />
      <AutoCompleteDesktopFilters disabled={disabled} filterKey="county" placeholder="County" options={[]} />
      <MinMaxDesktopFilters
        disabled={disabled}
        filterKey="acreage"
        options={acreagesFilters}
        placeHolder="Acreage"
        getOptionLabel={(item) => getAcreageLabel(item.min, item.max)}
      />
      <MinMaxDesktopFilters
        disabled={disabled}
        filterKey="voltPrice"
        options={priceFilters}
        placeHolder="VOLT Value"
        getOptionLabel={(item) => getMinMaxFilterLabel(item.min, item.max)}
      />
    </div>
  );
};

export default MarketPlaceDesktopFilters;
