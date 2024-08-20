import MobileFilterItem from "@/components/@new/filters/mobile/mobile-filter-item";
import MobileFiltersDrawer from "@/components/@new/filters/mobile/mobile-filters-drawer";
import MinMaxMobileFilter from "@/components/@new/filters/mobile/mobile-min-max-filter";
import { acreagesFilters, getAcreageLabel, priceFilters } from "@/components/@new/lands/filters/lands-filters-utils";
import { getMinMaxFilterLabel } from "@/components/@new/shared/filters/filters-utils";
import RadioButton from "@/components/@new/shared/forms/RadioButton";
import { getAllStates } from "@/helpers/states";
import { IMarketplaceFilters } from "@/types/lands";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

interface MarketplaceMobileFiltersProps {
  filters: IMarketplaceFilters;
  setFilters: Dispatch<SetStateAction<IMarketplaceFilters>>;
  disabled?: boolean;
}
const MarketplaceMobileFilters: FC<MarketplaceMobileFiltersProps> = ({ disabled, filters, setFilters }) => {
  const [localFilters, setLocalFilters] = useState<IMarketplaceFilters | null>(null);
  const [open, setOpen] = useState<"states" | "counties" | "acreage" | "voltValue" | null>(null);

  return (
    <MobileFiltersDrawer
      onOpen={() => setLocalFilters(filters)}
      onClose={() => {
        setLocalFilters(filters);
        setOpen(null);
      }}
      onReset={() => {
        setLocalFilters(filters);
        setOpen(null);
      }}
      onOK={() => {
        if (localFilters) {
          setFilters(localFilters);
          setOpen(null);
        }
      }}
      disabled={disabled}
    >
      <MobileFilterItem open={open === "states"} toggleFilter={() => setOpen(open === "states" ? null : "states")} filterName="States">
        {getAllStates().map((state) => (
          <RadioButton
            checked={!!localFilters?.states?.includes(state.value)}
            key={state.value}
            name={state.value}
            label={state.label}
            onChange={() => {
              if (localFilters) {
                const newLocalFilters = { ...localFilters };
                if (newLocalFilters.states?.includes(state.value)) {
                  newLocalFilters.states = newLocalFilters.states.filter((el) => el !== state.value);
                } else {
                  newLocalFilters.states = [...(newLocalFilters?.states || []), state.value];
                }
                setLocalFilters({ ...newLocalFilters });
              }
            }}
          />
        ))}
      </MobileFilterItem>
      <MobileFilterItem
        open={open === "counties"}
        toggleFilter={() => setOpen(open === "counties" ? null : "counties")}
        filterName="Counties"
        disabled={!localFilters?.states || localFilters?.states?.length === 0}
      >
        {getAllStates().map((state) => (
          <RadioButton
            checked={!!localFilters?.states?.includes(state.value)}
            key={state.value}
            name={state.value}
            label={state.label}
            onChange={() => {
              if (localFilters) {
                const newLocalFilters = { ...localFilters };
                if (newLocalFilters.states?.includes(state.value)) {
                  newLocalFilters.states = newLocalFilters.states.filter((el) => el !== state.value);
                } else {
                  newLocalFilters.states = [...(newLocalFilters?.states || []), state.value];
                }
                setLocalFilters({ ...newLocalFilters });
              }
            }}
          />
        ))}
      </MobileFilterItem>
      <MobileFilterItem open={open === "acreage"} toggleFilter={() => setOpen(open === "acreage" ? null : "acreage")} filterName="Acreage">
        <MinMaxMobileFilter
          options={acreagesFilters}
          onChange={(acreage) => {
            setFilters({ ...filters, acreageMin: acreage.min, acreageMax: acreage.max });
          }}
          value={{ min: filters.acreageMin, max: filters.acreageMax }}
          renderLabel={getAcreageLabel}
        />
      </MobileFilterItem>
      <MobileFilterItem
        open={open === "voltValue"}
        toggleFilter={() => setOpen(open === "voltValue" ? null : "voltValue")}
        filterName="VOLT Value"
      >
        <MinMaxMobileFilter
          options={priceFilters}
          onChange={(acreage) => {
            setFilters({ ...filters, acreageMin: acreage.min, acreageMax: acreage.max });
          }}
          value={{ min: filters.acreageMin, max: filters.acreageMax }}
          renderLabel={getMinMaxFilterLabel}
        />
      </MobileFilterItem>
    </MobileFiltersDrawer>
  );
};

export default MarketplaceMobileFilters;
