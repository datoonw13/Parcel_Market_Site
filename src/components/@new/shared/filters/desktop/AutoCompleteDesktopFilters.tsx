"use client";

import React, { FC } from "react";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AutoComplete from "../../forms/AutoComplete";

interface AutoCompleteDesktopFiltersProps {
  options: Array<{ label: string; value: string }>;
  placeholder: string;
  filterKey: string;
}

const AutoCompleteDesktopFilters: FC<AutoCompleteDesktopFiltersProps> = ({ options, placeholder, filterKey }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);
  const selectedValue = params.get(filterKey);

  const handleSelect = (newValue: string | null) => {
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
      options={options}
      getOptionLabel={(item) => item.label}
      getOptionKey={(item) => item.value}
      onChange={(option) => handleSelect(option?.value || null)}
      placeholder={placeholder}
      value={options.find((option) => option.value === selectedValue) || null}
      onFilter={(searchValue, items) => items.filter((item) => item.label.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))}
      getSelectedOption={(item) => item.value === selectedValue}
    />
  );
};

export default AutoCompleteDesktopFilters;
