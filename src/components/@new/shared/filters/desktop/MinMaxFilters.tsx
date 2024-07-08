import { FC, useState } from "react";
import AutoComplete from "@/components/@new/shared/forms/AutoComplete";
import AutoCompleteListBox from "@/components/@new/shared/forms/AutoComplete/AutoCompleteListBox";
import AutoCompleteListItem from "@/components/@new/shared/forms/AutoComplete/AutoCompleteListItem";
import Button from "@/components/@new/shared/forms/Button";
import TextField from "@/components/@new/shared/forms/TextField";
import clsx from "clsx";

interface MinMaxFiltersProps {
  options: Array<{ min: number | null; max: number | null }>;
  value: { min: number | null; max: number | null };
  onChange: (value: { min: number | null; max: number | null }) => void;
  placeHolder?: string;
  getOptionLabel: (item: { min: number | null; max: number | null }) => string;
}

const MinMaxFilters: FC<MinMaxFiltersProps> = ({ options, value, onChange, placeHolder, getOptionLabel }) => {
  const [filters, setFilters] = useState<{ min: number | null; max: number | null }>({
    min: null,
    max: null,
  });

  const isSelected = (item: MinMaxFiltersProps["value"]) => JSON.stringify(filters) === JSON.stringify(item);
  const disableSelect = filters.max && Number(filters.max) <= Number(filters.min);

  return (
    <AutoComplete
      inputRootClassName={clsx(
        "!h-[36px] [&>input::placeholder]:text-black",
        (value.min || value.max) && "[&>input]:bg-primary-main-100 [&>input]:!border-primary-main-400"
      )}
      options={options}
      getOptionLabel={getOptionLabel}
      getOptionKey={(item) => ""}
      onChange={(item) => {
        onChange({ min: null, max: null });
        setFilters({ min: null, max: null });
      }}
      placeholder={placeHolder}
      readOnly
      value={value.min || value.max ? value : ""}
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
            >
              {getOptionLabel(item)}
            </AutoCompleteListItem>
          ))}
          <hr className="w-full border-grey-100" />
          <div className="flex p-3 justify-end gap-3">
            <Button
              className="!h-10"
              // variant="text"
              onClick={() => {
                setReferenceElement(null);
                setFilters({ min: value.min, max: value.max });
              }}
            >
              Clear
            </Button>
            <Button
              className="!h-10"
              disabled={!!disableSelect}
              onClick={() => {
                setReferenceElement(null);
                onChange({
                  min: filters.min ? filters.min : null,
                  max: filters.max ? filters.max : null,
                });
                setFilters({
                  min: filters.min ? filters.min : null,
                  max: filters.max ? filters.max : null,
                });
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

export default MinMaxFilters;
