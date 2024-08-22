"use client";

import { useMemo } from "react";
import MultiSelect from "@/components/@new/filters/desktop/multi-select";
import { getAllStates, getCounties } from "@/helpers/states";
import { uniqBy } from "lodash";
import { acreagesFilters, getAcreageLabel, getMinMaxFilterLabel, priceFilters } from "@/components/@new/shared/filters/filters-utils";
import { IMarketplaceFilters } from "@/types/lands";
import MinMaxDesktopFilters from "@/components/@new/filters/desktop/min-max-filter";

const MarketplaceDesktopFilters = ({
  disabled,
  selectedFilters,
  onChange,
}: {
  selectedFilters: IMarketplaceFilters;
  onChange: <T extends keyof IMarketplaceFilters>(data: { [key in T]: IMarketplaceFilters[T] }) => void;
  disabled?: boolean;
}) => {
  const states = useMemo(() => getAllStates(), []);
  const counties = useMemo(() => {
    const countiesList =
      selectedFilters.states?.map((state) =>
        getCounties(state).map((x) => ({ ...x, label: `${x.label}(${state.toLocaleUpperCase()})` }))
      ) || [];
    return uniqBy(countiesList.flat(), "value");
  }, [selectedFilters.states]);

  return (
    <div className="grid w-full grid-cols-4 gap-3">
      <MultiSelect
        selectedOptions={selectedFilters.states || []}
        onChange={(newStates) => {
          onChange({
            states: newStates.length === 0 ? null : newStates,
            counties: null,
          });
        }}
        disabled={disabled}
        initialOptions={states}
        placeholder="States"
      />
      <MultiSelect
        selectedOptions={selectedFilters.counties || []}
        onChange={(newCounties) => {
          onChange({ counties: newCounties.length === 0 ? null : newCounties });
        }}
        initialOptions={counties}
        disabled={!selectedFilters.states || selectedFilters.states?.length === 0 || disabled}
        placeholder="Counties"
      />
      <MinMaxDesktopFilters
        disabled={disabled}
        onChange={(acreage) => {
          onChange({
            acreageMin: acreage.min,
            acreageMax: acreage.max,
          });
        }}
        selectedValue={{ min: selectedFilters.acreageMin, max: selectedFilters.acreageMax }}
        options={acreagesFilters}
        placeHolder="Acreage"
        getOptionLabel={(item) => getAcreageLabel(item.min, item.max)}
      />
      <MinMaxDesktopFilters
        disabled={disabled}
        options={priceFilters}
        onChange={(voltValue) => {
          onChange({
            voltValueMin: voltValue.min,
            voltValueMax: voltValue.max,
          });
        }}
        selectedValue={{ min: selectedFilters.voltValueMin, max: selectedFilters.voltValueMax }}
        placeHolder="VOLT Value"
        getOptionLabel={(item) => getMinMaxFilterLabel(item.min, item.max)}
      />
    </div>
  );
};

export default MarketplaceDesktopFilters;
