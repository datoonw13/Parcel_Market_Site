import { FC, useEffect, useState } from "react";
import AutoComplete from "@/components/@new/shared/forms/AutoComplete";
import AutoCompleteListBox from "@/components/@new/shared/forms/AutoComplete/AutoCompleteListBox";
import AutoCompleteListItem from "@/components/@new/shared/forms/AutoComplete/AutoCompleteListItem";
import Button from "@/components/@new/shared/forms/Button";
import clsx from "clsx";
import TextField from "@/components/@new/shared/forms/text-field";

interface MinMaxDesktopFiltersProps {
  options: Array<{ min: number | null; max: number | null }>;
  placeHolder?: string;
  getOptionLabel: (item: { min: number | null; max: number | null }) => string;
  disabled?: boolean;
  onChange: (item: { min: number | null; max: number | null }) => void;
  selectedValue: { min: number | null; max: number | null };
}

const MinMaxDesktopFilters: FC<MinMaxDesktopFiltersProps> = ({
  options,
  placeHolder,
  getOptionLabel,
  disabled,
  onChange,
  selectedValue,
}) => {
  const [filters, setFilters] = useState<{ min: number | null; max: number | null }>({
    min: null,
    max: null,
  });
  const isSelected = (item: MinMaxDesktopFiltersProps["options"][0]) => JSON.stringify(filters) === JSON.stringify(item);
  const disableSelect = filters.max && Number(filters.max) <= Number(filters.min);

  return (
    <AutoComplete
      inputRootClassName={clsx(
        "!h-[36px] [&>input::placeholder]:text-black",
        (selectedValue.min || selectedValue.max) && "[&>input]:bg-primary-main-100 [&>input]:!border-primary-main-400"
      )}
      options={options}
      disableSameWidth
      disabled={disabled}
      getOptionLabel={getOptionLabel}
      getOptionKey={(item) => ""}
      onChange={(item) => {
        setFilters({ min: null, max: null });
        onChange({ min: null, max: null });
      }}
      placeholder={placeHolder}
      readOnly
      value={selectedValue.min || selectedValue.max ? selectedValue : ""}
      renderContent={(setReferenceElement, options) => (
        <AutoCompleteListBox className="!max-h-max">
          <div className="flex gap-0.5 items-center p-4">
            <TextField
              onChange={(newVal) => {
                setFilters({ ...filters, min: Number(newVal) });
              }}
              placeholder="Min"
              type="number"
              className="!h-[38px]"
              value={filters.min ? filters.min.toString() : ""}
            />
            <hr className="w-7 border-grey-100" />
            <TextField
              onChange={(newVal) => {
                setFilters({ ...filters, max: Number(newVal) });
              }}
              onBlur={() => setFilters({ ...filters, min: Number(filters.min) || null })}
              placeholder="Max"
              className="!h-[38px]"
              value={filters.max ? filters.max.toString() : ""}
            />
          </div>
          {options.map((item) => (
            <AutoCompleteListItem
              key={item.min}
              onClick={() => setFilters({ min: item.min, max: item.max })}
              id={item.min?.toString() || ""}
              selected={isSelected(item)}
              className="w-max min-w-full"
            >
              {getOptionLabel(item)}
            </AutoCompleteListItem>
          ))}
          <hr className="w-full border-grey-100" />
          <div className="flex p-3 gap-3">
            <Button
              className="!h-10 !px-5 w-full !outline-none"
              variant="secondary"
              onClick={() => {
                setReferenceElement(null);
                setFilters({ min: null, max: null });
                onChange({ min: null, max: null });
              }}
            >
              Clear
            </Button>
            <Button
              className="!h-10 !px-5 w-full"
              disabled={!!disableSelect}
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

export default MinMaxDesktopFilters;
