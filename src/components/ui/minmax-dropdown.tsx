"use client";

import { FC, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { NumberInput, TextInput } from "./input";
import { Button } from "./button";

interface Option {
  min: number | null;
  max: number | null;
}

interface MinmaxDropdownProps {
  data: Array<Option>;
  onChange: (value: Option) => void;
  selectedValue: Option | null;
  placeholder: string;
  renderOption: (value: Option | null) => string;
  renderInputValue: (value: Option | null) => string;
  inputPrefix?: string;
}

const MinmaxDropdown: FC<MinmaxDropdownProps> = ({
  data,
  onChange,
  selectedValue,
  placeholder,
  renderOption,
  renderInputValue,
  inputPrefix,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Option>({ min: null, max: null });

  const disableOk = typeof value.min === "number" && typeof value.max === "number" && value.min >= value.max;

  useEffect(() => {
    if (selectedValue) {
      setValue(selectedValue);
    }
  }, [selectedValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <TextInput
          endIcon={open ? <IoChevronUp /> : <IoChevronDown />}
          rootClassName={cn(
            "w-full h-9 rounded-2xl",
            open && "[&>.end-icon]:!pointer-events-none [&>.start-icon]:!pointer-events-none !border-primary-main"
          )}
          placeholder={placeholder}
          readOnly
          value={renderInputValue(selectedValue)}
        />
      </PopoverTrigger>
      <PopoverContent className=" bg-white p-0 border-0 shadow-4 rounded-2xl !w-full !max-w-max">
        <div className="min-w-[240px] max-w-[240px] !w-full gap-1 pt-4 rounded-2xl space-y-2">
          <MinmaxDropdownContent
            data={data}
            renderOption={renderOption}
            value={value}
            error={!!disableOk}
            inputPrefix={inputPrefix}
            onInputChange={(val) => setValue({ ...val })}
          />
          <div className="flex justify-end w-full gap-3 px-3 py-4 border-t border-t-grey-100">
            <Button
              onClick={() => {
                setOpen(false);
                setValue({ min: null, max: null });
                onChange({ min: null, max: null });
              }}
              variant="secondary"
              className="bg-transparent !outline-none"
            >
              Clear
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                onChange(value);
              }}
              disabled={!!disableOk}
            >
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MinmaxDropdown;

interface MinmaxDropdownContentProps {
  error?: boolean;
  inputPrefix?: string;
  value: Option;
  onInputChange: (value: Option) => void;
  data: Array<Option>;
  renderOption: (value: Option | null) => string;
  disablePadding?: boolean;
}
export const MinmaxDropdownContent: FC<MinmaxDropdownContentProps> = ({
  error,
  inputPrefix,
  value,
  onInputChange,
  data,
  renderOption,
  disablePadding,
}) => (
  <>
    <div className={cn("flex items-center", !disablePadding && "px-4")}>
      <NumberInput
        error={!!error}
        prefix={inputPrefix}
        value={typeof value.min === "number" || value.min === 0 ? value.min : ""}
        onValueChange={(e, x) => {
          onInputChange({ min: e.floatValue || e.floatValue === 0 ? e.floatValue : null, max: value.max });
        }}
        rootClassName="w-full h-[38px]"
        placeholder="Min"
      />
      <hr className="bg-grey-100 w-3" />
      <NumberInput
        error={!!error}
        prefix={inputPrefix}
        value={typeof value.max === "number" || value.max === 0 ? value.max : ""}
        onValueChange={(e, x) => {
          onInputChange({ max: e.floatValue || e.floatValue === 0 ? e.floatValue : null, min: value.min });
        }}
        rootClassName="w-full h-[38px]"
        placeholder="Max"
      />
    </div>
    <ul className={cn(disablePadding && "mt-2")}>
      {data.map((item) => (
        <li
          key={JSON.stringify(item)}
          onClick={() => onInputChange({ min: item.min, max: item.max })}
          className={cn(
            "font-medium text-xs py-2 cursor-pointer hover:bg-primary-main-50 transition-all duration-100",
            (value.min || 0) === (item.min || 0) && value.max === item.max && "!bg-primary-main-100",
            disablePadding ? "px-2 rounded-sm" : "px-4"
          )}
        >
          {/* {item.label} */}
          {renderOption(item)}
        </li>
      ))}
    </ul>
  </>
);
