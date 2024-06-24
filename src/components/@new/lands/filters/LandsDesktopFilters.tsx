"use client";

import { getAllStates, getCounties, getCountyValue, getStateValue } from "@/helpers/states";
import { useState } from "react";
import clsx from "clsx";
import AutoComplete from "../../shared/forms/AutoComplete";

const LandsDesktopFilters = () => {
  const [filters, setFilters] = useState<{
    state: string | null;
    county: string | null;
    acreages: { min: number | null; max: number | null };
  }>({
    state: null,
    county: null,
    acreages: { min: null, max: null },
  });
  const [acreagesTempFilters, setAcreagesTempFilters] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
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
        {/* <AutoComplete
          inputRootClassName={clsx(
            "!h-[36px] [&>input::placeholder]:text-black",
            filters.county && "[&>input]:bg-primary-main-100 [&>input]:!border-primary-main-400"
          )}
          options={acreagesFilters}
          getOptionLabel={(item) => ""}
          getOptionKey={(item) => ""}
          onChange={(item) => {}}
          placeholder="County"
          value={null}
          renderContent={(setReferenceElement, options) => (
            <AutoCompleteListBox>
              <div className="flex gap-0.5 items-center p-4">
                <TextField
                  onChange={(value) => {}}
                  placeholder="Min"
                  className="!h-[38px]"
                  value={filters.acreages.min ? filters.acreages.min.toString() : ""}
                />
                <hr className="w-7 border-grey-100" />
                <TextField
                  onChange={(value) => {}}
                  placeholder="Max"
                  className="!h-[38px]"
                  value={filters.acreages.max ? filters.acreages.max.toString() : ""}
                />
              </div>
              {options.map((item) => (
                <AutoCompleteListItem key={item.min} onClick={() => setFilters({ ...filters, acreages: item })} id="">
                  {`${item.min - 1}+ Acres`}
                </AutoCompleteListItem>
              ))}
              <hr className="w-full border-grey-100" />
              <div className="">
                <Button>Clear</Button>
                <Button>Done</Button>
              </div>
            </AutoCompleteListBox>
          )}
        /> */}
      </div>
    </div>
  );
};

export default LandsDesktopFilters;
