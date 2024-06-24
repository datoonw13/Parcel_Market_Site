import AutoComplete from "@/components/@new/shared/forms/AutoComplete";
import AutoCompleteListBox from "@/components/@new/shared/forms/AutoComplete/AutoCompleteListBox";
import AutoCompleteListItem from "@/components/@new/shared/forms/AutoComplete/AutoCompleteListItem";
import Button from "@/components/@new/shared/forms/Button";
import TextField from "@/components/@new/shared/forms/TextField";
import clsx from "clsx";
import React, { FC, useState } from "react";
import { numericInput } from "@/helpers/common";
import { getAcreageLabel } from "../lands-filters-utils";

interface LandsDesktopFiltersMinMaxProps {
  options: Array<{ min: number | null; max: number | null }>;
  value: { min: number | null; max: number | null };
  onChange: (value: { min: number | null; max: number | null }) => void;
  placeHolder?: string;
}

const LandsDesktopFiltersMinMax: FC<LandsDesktopFiltersMinMaxProps> = ({ options, value, onChange, placeHolder }) => {
  const [filters, setFilters] = useState<{ min: string | null; max: string | null }>({ min: null, max: null });

  const isSelected = (item: LandsDesktopFiltersMinMaxProps["value"]) => JSON.stringify(filters) === JSON.stringify(item);
  console.log(getAcreageLabel(value.min, value.max));

  return (
    <AutoComplete
      inputRootClassName={clsx(
        "!h-[36px] [&>input::placeholder]:text-black",
        (value.min || value.max) && "[&>input]:bg-primary-main-100 [&>input]:!border-primary-main-400"
      )}
      options={options}
      getOptionLabel={(item) => getAcreageLabel(item.min, item.max)}
      getOptionKey={(item) => ""}
      onChange={(item) => onChange({ min: null, max: null })}
      placeholder={placeHolder}
      readOnly
      value={value}
      renderContent={(setReferenceElement, options) => (
        <AutoCompleteListBox className="!max-h-max">
          <div className="flex gap-0.5 items-center p-4">
            <TextField
              onChange={(newVal) => {
                const { valid, value } = numericInput(newVal);

                if (valid) {
                  setFilters({ ...filters, min: value });
                }
              }}
              placeholder="Min"
              className="!h-[38px]"
              value={filters.min ? filters.min.toString() : ""}
            />
            <hr className="w-7 border-grey-100" />
            <TextField
              onChange={(newVal) => {
                const { valid, value } = numericInput(newVal);

                if (valid) {
                  setFilters({ ...filters, max: value });
                }
              }}
              onBlur={() => setFilters({ ...filters, min: Number(filters.min).toString() || null })}
              placeholder="Max"
              className="!h-[38px]"
              value={filters.max ? filters.max.toString() : ""}
            />
          </div>
          {options.map((item) => (
            <AutoCompleteListItem
              key={item.min}
              onClick={() => setFilters({ min: item.min?.toString() || "", max: filters.max?.toString() || "" })}
              id={item.min?.toString() || ""}
              selected={isSelected(item)}
            >
              {getAcreageLabel(item.min, item.max)}
            </AutoCompleteListItem>
          ))}
          <hr className="w-full border-grey-100" />
          <div className="flex p-3 justify-end gap-3">
            <Button
              className="!h-10"
              variant="text"
              onClick={() => {
                setReferenceElement(null);
                setFilters({ ...value });
              }}
            >
              Clear
            </Button>
            <Button
              className="!h-10"
              onClick={() => {
                setReferenceElement(null);
                onChange(filters);
              }}
            >
              Done
            </Button>
          </div>
        </AutoCompleteListBox>
      )}
    />
  );
};

export default LandsDesktopFiltersMinMax;
