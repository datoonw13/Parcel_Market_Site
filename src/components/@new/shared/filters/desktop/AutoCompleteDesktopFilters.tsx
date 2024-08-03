"use client";

import React, { FC } from "react";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getCounties, getCountyValue } from "@/helpers/states";
import AutoComplete from "../../forms/AutoComplete";

interface AutoCompleteDesktopFiltersProps {
  options: Array<{ label: string; value: string }>;
  placeholder: string;
  filterKey: string;
  loading?: boolean;
  disabled?: boolean;
}

const AutoCompleteDesktopFilters: FC<AutoCompleteDesktopFiltersProps> = ({ options, placeholder, filterKey, loading, disabled }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);
  const selectedValue =
    filterKey === "county"
      ? getCountyValue(params.get("county"), params.get("state"))
      : options.find((el) => el.value === params.get(filterKey)) || null;

  const handleSelect = (newValue: string | null) => {
    if (filterKey === "state") {
      params.delete("county");
    }
    if (newValue) {
      params.set(filterKey, newValue);
    } else {
      params.delete(filterKey);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <AutoComplete
      inputRootClassName={clsx(
        "!h-[36px] [&>input::placeholder]:text-black",
        selectedValue && "[&>input]:bg-primary-main-100 [&>input]:!border-primary-main-400"
      )}
      options={filterKey === "county" ? getCounties(params.get("state")) : options}
      loading={loading}
      disabled={(filterKey === "county" && !params.get("state")) || disabled}
      getOptionLabel={(item) => item.label}
      getOptionKey={(item) => item.value}
      onChange={(option) => handleSelect(option?.value || null)}
      placeholder={placeholder}
      value={selectedValue}
      onFilter={(searchValue, items) => items.filter((item) => item.label.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))}
      getSelectedOption={(item) => item.value === selectedValue?.value}
    />
  );
};

export default AutoCompleteDesktopFilters;
