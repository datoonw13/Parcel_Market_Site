"use client";

import { Dispatch, SetStateAction, useMemo } from "react";
import MultiSelect from "@/components/@new/filters/desktop/multi-select";
import { getAllStates, getCounties } from "@/helpers/states";
import { uniqBy } from "lodash";
import MinMaxDesktopFilters from "@/components/@new/shared/filters/desktop/MinMaxDesktopFilters";
import { acreagesFilters, getAcreageLabel, getMinMaxFilterLabel, priceFilters } from "@/components/@new/shared/filters/filters-utils";
import { IMarketplaceFilters } from "@/types/lands";

const MarketplaceDesktopFilters = ({
  disabled,
  filters,
  setFilters,
}: {
  disabled?: boolean;
  filters: IMarketplaceFilters;
  setFilters: Dispatch<SetStateAction<IMarketplaceFilters>>;
}) => {
  const states = useMemo(() => getAllStates(), []);
  const counties = useMemo(() => {
    const countiesList = filters.states?.map((state) => getCounties(state)) || [];
    return uniqBy(countiesList.flat(), "value");
  }, [filters.states]);

  return (
    <div className="grid w-full grid-cols-4 gap-3">
      <MultiSelect
        selectedOptions={filters.states || []}
        onChange={(newStates) => {
          setFilters({ ...filters, states: newStates.length === 0 ? null : newStates, counties: null });
        }}
        disabled={disabled}
        initialOptions={states}
        placeholder="States"
      />
      <MultiSelect
        selectedOptions={filters.counties || []}
        onChange={(newCounties) => setFilters({ ...filters, counties: newCounties.length === 0 ? null : newCounties })}
        initialOptions={counties}
        disabled={filters.states?.length === 0 || disabled}
        placeholder="Counties"
      />
      <MinMaxDesktopFilters
        disabled={disabled}
        onChange={(acreage) => setFilters({ ...filters, acreageMin: acreage.min, acreageMax: acreage.max })}
        selectedValue={{ min: filters.acreageMin, max: filters.acreageMax }}
        options={acreagesFilters}
        placeHolder="Acreage"
        getOptionLabel={(item) => getAcreageLabel(item.min, item.max)}
      />
      <MinMaxDesktopFilters
        disabled={disabled}
        options={priceFilters}
        onChange={(voltValue) => setFilters({ ...filters, voltValueMin: voltValue.min, voltValueMax: voltValue.max })}
        selectedValue={{ min: filters.voltValueMin, max: filters.voltValueMax }}
        placeHolder="VOLT Value"
        getOptionLabel={(item) => getMinMaxFilterLabel(item.min, item.max)}
      />
    </div>
  );
};

export default MarketplaceDesktopFilters;
