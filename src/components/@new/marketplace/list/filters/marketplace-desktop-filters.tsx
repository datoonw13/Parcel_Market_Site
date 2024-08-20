"use client";

import { useMemo, useState } from "react";
import MultiSelect from "@/components/@new/filters/desktop/multi-select";
import { getAllStates, getCounties } from "@/helpers/states";
import { uniqBy } from "lodash";
import MinMaxDesktopFilters from "@/components/@new/shared/filters/desktop/MinMaxDesktopFilters";
import { acreagesFilters, getAcreageLabel, getMinMaxFilterLabel, priceFilters } from "@/components/@new/shared/filters/filters-utils";

const MarketplaceDesktopFilters = ({ disabled }: { disabled?: boolean }) => {
  const [filters, setFilters] = useState<{
    states: string[];
    counties: string[];
    acreage: { min: number | null; max: number | null };
    voltValue: { min: number | null; max: number | null };
  }>({
    states: [],
    counties: [],
    acreage: { min: null, max: null },
    voltValue: { min: null, max: null },
  });
  const states = useMemo(() => getAllStates(), []);
  const counties = useMemo(() => {
    const countiesList = filters.states.map((state) => getCounties(state));
    return uniqBy(countiesList.flat(), "value");
  }, [filters.states]);

  return (
    <div className="grid w-full grid-cols-4 gap-3">
      <MultiSelect
        selectedOptions={filters.states}
        onChange={(states) => setFilters({ ...filters, states, counties: [] })}
        disabled={disabled}
        initialOptions={states}
        placeholder="States"
      />
      <MultiSelect
        selectedOptions={filters.counties}
        onChange={(counties) => setFilters({ ...filters, counties })}
        initialOptions={counties}
        disabled={filters.states.length === 0 || disabled}
        placeholder="Counties"
      />
      <MinMaxDesktopFilters
        disabled={disabled}
        onChange={(acreage) => setFilters({ ...filters, acreage })}
        selectedValue={filters.acreage}
        options={acreagesFilters}
        placeHolder="Acreage"
        getOptionLabel={(item) => getAcreageLabel(item.min, item.max)}
      />
      <MinMaxDesktopFilters
        disabled={disabled}
        options={priceFilters}
        onChange={(voltValue) => setFilters({ ...filters, voltValue })}
        selectedValue={filters.voltValue}
        placeHolder="VOLT Value"
        getOptionLabel={(item) => getMinMaxFilterLabel(item.min, item.max)}
      />
    </div>
  );
};

export default MarketplaceDesktopFilters;
