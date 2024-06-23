"use client";

import { getAllStates, getCounties, getCountyValue, getStateValue } from "@/helpers/states";
import { useState } from "react";
import clsx from "clsx";
import AutoComplete from "../../shared/forms/AutoComplete";

const LandsDesktopFilters = () => {
  const [filters, setFilters] = useState<{
    state: string | null;
    county: string | null;
  }>({
    state: null,
    county: null,
  });
  return (
    <div>
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
        />
      </div>
    </div>
  );
};

export default LandsDesktopFilters;
