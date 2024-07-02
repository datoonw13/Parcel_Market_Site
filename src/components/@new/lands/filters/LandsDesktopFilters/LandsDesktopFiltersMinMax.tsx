import { FC, useState } from "react";
import AutoComplete from "@/components/@new/shared/forms/AutoComplete";
import AutoCompleteListBox from "@/components/@new/shared/forms/AutoComplete/AutoCompleteListBox";
import AutoCompleteListItem from "@/components/@new/shared/forms/AutoComplete/AutoCompleteListItem";
import Button from "@/components/@new/shared/forms/Button";
import TextField from "@/components/@new/shared/forms/TextField";
import clsx from "clsx";

interface LandsDesktopFiltersMinMaxProps {
  options: Array<{ min: number | string | null; max: number | string | null }>;
  value: { min: number | string | null; max: number | string | null };
  onChange: (value: { min: number | string | null; max: number | string | null }) => void;
  placeHolder?: string;
  getOptionLabel: (item: { min: number | string | null; max: number | string | null }) => string;
}

const LandsDesktopFiltersMinMax: FC<LandsDesktopFiltersMinMaxProps> = ({ options, value, onChange, placeHolder, getOptionLabel }) => {
  const [filters, setFilters] = useState<{ min: string | number | string | null; max: string | number | string | null }>({
    min: null,
    max: null,
  });

  const isSelected = (item: LandsDesktopFiltersMinMaxProps["value"]) => JSON.stringify(filters) === JSON.stringify(item);
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
                setFilters({ ...filters, min: newVal });
              }}
              placeholder="Min"
              type="number"
              className="!h-[38px]"
              value={filters.min ? filters.min.toString() : ""}
            />
            <hr className="w-7 border-grey-100" />
            <TextField
              onChange={(newVal) => {
                setFilters({ ...filters, max: newVal });
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
              onClick={() => setFilters({ min: item.min?.toString() || "", max: item.max?.toString() || "" })}
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
                  min: filters.min ? parseFloat(filters.min.toString()) : null,
                  max: filters.max ? parseFloat(filters.max.toString()) : null,
                });
                setFilters({
                  min: filters.min ? parseFloat(filters.min.toString()) : null,
                  max: filters.max ? parseFloat(filters.max.toString()) : null,
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

export default LandsDesktopFiltersMinMax;
