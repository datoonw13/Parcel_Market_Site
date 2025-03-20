import { Dispatch, FC, SetStateAction, useMemo, useState } from "react";
import MobileFilterItem from "@/components/@new/filters/mobile/mobile-filter-item";
import MobileFiltersDrawer from "@/components/@new/filters/mobile/mobile-filters-drawer";
import MinMaxMobileFilter from "@/components/@new/filters/mobile/mobile-min-max-filter";
import { acreagesFilters, getAcreageLabel, priceFilters } from "@/components/@new/lands/filters/lands-filters-utils";
import { getMinMaxFilterLabel } from "@/components/@new/shared/filters/filters-utils";
import RadioButton from "@/components/@new/shared/forms/RadioButton";
import { getAllStates, getCounties } from "@/helpers/states";
import { IMarketplaceFilters } from "@/types/lands";
import { uniqBy } from "lodash";
import { z } from "zod";
import { userPropertiesFiltersValidations } from "@/zod-validations/filters-validations";

type Filters = z.infer<typeof userPropertiesFiltersValidations>;

interface UserPropertiesMobileFiltersProps {
  disabled?: boolean;
  selectedFilters: Filters;
  onChange: <T extends keyof Filters>(data: { [key in T]: Filters[T] }) => void;
}
const UserPropertiesMobileFilters: FC<UserPropertiesMobileFiltersProps> = ({ disabled, selectedFilters, onChange }) => {
  const [localFilters, setLocalFilters] = useState<Filters | null>(null);
  const [open, setOpen] = useState<"states" | "counties" | "acreage" | "voltPrice" | null>(null);
  const states = useMemo(() => getAllStates(), []);
  const counties = useMemo(() => {
    const countiesList = selectedFilters.states?.map((state) => getCounties(state)) || [];
    return uniqBy(countiesList.flat(), "value");
  }, [selectedFilters.states]);

  return (
    <MobileFiltersDrawer
      onOpen={() => setLocalFilters(selectedFilters)}
      onClose={() => {
        setLocalFilters(selectedFilters);
        setOpen(null);
      }}
      onOK={() => {
        if (localFilters) {
          onChange(localFilters);
          setOpen(null);
        }
      }}
      disabled={disabled}
    >
      <MobileFilterItem open={open === "states"} toggleFilter={() => setOpen(open === "states" ? null : "states")} filterName="States">
        {states.map((state) => (
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
        {counties.map((state) => (
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
            if (localFilters) {
              setLocalFilters({ ...localFilters, acreageMin: acreage.min, acreageMax: acreage.max });
            }
          }}
          value={{ min: localFilters?.acreageMin || null, max: localFilters?.acreageMax || null }}
          renderLabel={getAcreageLabel}
        />
      </MobileFilterItem>
      <MobileFilterItem
        open={open === "voltPrice"}
        toggleFilter={() => setOpen(open === "voltPrice" ? null : "voltPrice")}
        filterName="VOLT Value"
      >
        <MinMaxMobileFilter
          options={priceFilters}
          onChange={(voltPrice) => {
            if (localFilters) {
              setLocalFilters({ ...localFilters, voltPriceMin: voltPrice.min, voltPriceMax: voltPrice.max });
            }
          }}
          value={{ min: localFilters?.voltPriceMin || null, max: localFilters?.voltPriceMax || null }}
          renderLabel={getMinMaxFilterLabel}
        />
      </MobileFilterItem>
    </MobileFiltersDrawer>
  );
};

export default UserPropertiesMobileFilters;
