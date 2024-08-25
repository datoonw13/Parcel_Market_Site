"use client";

import { useMemo } from "react";
import MultiSelect from "@/components/@new/filters/desktop/multi-select";
import { getAllStates, getCounties } from "@/helpers/states";
import { uniqBy } from "lodash";
import { acreagesFilters, getAcreageLabel, getMinMaxFilterLabel, priceFilters } from "@/components/@new/shared/filters/filters-utils";
import MinMaxDesktopFilters from "@/components/@new/filters/desktop/min-max-filter";
import { z } from "zod";
import { userPropertiesFiltersValidations } from "@/zod-validations/filters-validations";

type Filters = z.infer<typeof userPropertiesFiltersValidations>;

const UserPropertiesDesktopFilters = ({
  disabled,
  selectedFilters,
  onChange,
}: {
  selectedFilters: Filters;
  onChange: <T extends keyof Filters>(data: { [key in T]: Filters[T] }) => void;
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
        onChange={(voltPrice) => {
          onChange({
            voltPriceMin: voltPrice.min,
            voltPriceMax: voltPrice.max,
          });
        }}
        selectedValue={{ min: selectedFilters.voltPriceMin, max: selectedFilters.voltPriceMax }}
        placeHolder="VOLT Price"
        getOptionLabel={(item) => getMinMaxFilterLabel(item.min, item.max)}
      />
    </div>
  );
};

export default UserPropertiesDesktopFilters;
