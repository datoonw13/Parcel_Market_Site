"use client";

import { FC, useState } from "react";
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <TextInput
          endIcon={open ? <IoChevronUp /> : <IoChevronDown />}
          rootClassName={cn(
            "w-full h-9 rounded-2xl",
            open && "[&>.end-icon]:!pointer-events-none",
            open && "[&>.start-icon]:!pointer-events-none"
          )}
          placeholder={placeholder}
          readOnly
          value={renderInputValue(selectedValue)}
        />
      </PopoverTrigger>
      <PopoverContent className=" bg-white p-0 border-0 shadow-4 rounded-2xl !w-full !max-w-max">
        <div className="min-w-[240px] max-w-[240px] !w-full gap-1 pt-4 rounded-2xl space-y-2">
          <div className="flex items-center px-4">
            <NumberInput
              error={!!disableOk}
              prefix={inputPrefix}
              value={value.min || ""}
              onValueChange={(e) => setValue({ ...value, min: e.value ? Number(e.value) : null })}
              rootClassName="w-full h-[38px]"
              placeholder="Min"
            />
            <hr className="bg-grey-100 w-3" />
            <NumberInput
              error={!!disableOk}
              prefix={inputPrefix}
              value={value.max || ""}
              onValueChange={(e) => setValue({ ...value, max: e.value ? Number(e.value) : null })}
              rootClassName="w-full h-[38px]"
              placeholder="Max"
            />
          </div>
          <ul>
            {data.map((item) => (
              <li
                key={JSON.stringify(item)}
                onClick={() => setValue({ min: item.min, max: item.max })}
                className={cn(
                  "font-medium text-xs py-2 px-4 cursor-pointer hover:bg-primary-main-50 transition-all duration-100",
                  value.min === item.min && value.max === item.max && "!bg-primary-main-100"
                )}
              >
                {/* {item.label} */}
                {renderOption(item)}
              </li>
            ))}
          </ul>
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
