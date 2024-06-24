"use client";

import { getAllStates, getCounties, getCountyValue, getStateValue } from "@/helpers/states";
import { useState } from "react";
import clsx from "clsx";
import AutoComplete from "../../../shared/forms/AutoComplete";
import LandsDesktopFiltersMinMax from "./LandsDesktopFiltersMinMax";
import { acreagesFilters, getAcreageLabel, getPriceLabel, priceFilters } from "../lands-filters-utils";

const LandsDesktopFilters = () => {
  const [filters, setFilters] = useState<{
    state: string | null;
    county: string | null;
    acreages: { min: number | null; max: number | null };
    volt: { min: number | null; max: number | null };
  }>({
    state: null,
    county: null,
    acreages: { min: null, max: null },
    volt: { min: null, max: null },
  });
  console.log(filters);

  return (
    <div className="mb-8">
      <div className="grid gap-3 grid-cols-4">
        <AutoComplete
          inputRootClassName={clsx(
            "!h-[36px] [&>input::placeholder]:text-black",
            filters.state && "[&>input]:bg-primary-main-100 [&>input]:!border-primary-main-400"
          )}
          options={getAllStates()}
          getOptionLabel={(item) => item.label}
          getOptionKey={(item) => item.value}
          onChange={(item) => setFilters({ ...filters, state: item?.value || null, county: null })}
          placeholder="State"
          value={getStateValue(filters.state)}
          onFilter={(searchValue, items) =>
            items.filter((item) => item.label.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
          }
        />
        <AutoComplete
          inputRootClassName={clsx(
            "!h-[36px] [&>input::placeholder]:text-black",
            filters.county && "[&>input]:bg-primary-main-100 [&>input]:!border-primary-main-400"
          )}
          options={getCounties(filters.state)}
          getOptionLabel={(item) => item.label}
          getOptionKey={(item) => item.value}
          onChange={(item) => setFilters({ ...filters, county: item?.value || null })}
          placeholder="County"
          value={getCountyValue(filters.county, filters.state)}
          disabled={!filters.state}
          onFilter={(searchValue, items) =>
            items.filter((item) => item.label.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
          }
        />
        <LandsDesktopFiltersMinMax
          options={acreagesFilters}
          value={filters.acreages}
          onChange={(acreages) => setFilters({ ...filters, acreages })}
          placeHolder="Acreage"
          getOptionLabel={(item) => getAcreageLabel(item.min, item.max)}
        />
        <LandsDesktopFiltersMinMax
          options={priceFilters}
          value={filters.volt}
          onChange={(volt) => setFilters({ ...filters, volt })}
          placeHolder="VOLT Price"
          getOptionLabel={(item) => getPriceLabel(item.min, item.max)}
        />
      </div>
    </div>
  );
};

export default LandsDesktopFilters;
