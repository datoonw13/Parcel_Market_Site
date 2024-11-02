"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/helpers/common";
import { MdKeyboardArrowUp, MdKeyboardArrowDown, MdClear } from "react-icons/md";
import Popper from "../../shared/Popper";
import TextField from "../../shared/forms/text-field";
import AutoCompleteListBox from "../../shared/forms/AutoComplete/AutoCompleteListBox";
import CheckBox from "../../shared/forms/CheckBox";

interface MultiSelectProps {
  initialOptions: { label: string; value: string }[];
  placeholder: string;
  disabled?: boolean;
  selectedOptions: string[];
  onChange: (value: string[]) => void;
}
const MultiSelect: FC<MultiSelectProps> = ({ initialOptions, placeholder, disabled, selectedOptions, onChange }) => {
  const [options, setOptions] = useState<MultiSelectProps["initialOptions"] | null>(null);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const [searchValue, setSearchValue] = useState("");

  const inputValue = open
    ? searchValue
    : selectedOptions
        .map((el) => options?.find((x) => x.value === el)?.label)
        .filter(Boolean)
        .join(",") || "";

  const setSortedData = useCallback(() => {
    if (!open) {
      const checkedOptions = initialOptions.filter((el) => selectedOptions.includes(el.value));
      const otherOptions = initialOptions.filter((el) => !selectedOptions.includes(el.value));
      setOptions([...checkedOptions, ...otherOptions]);
    }
  }, [initialOptions, open, selectedOptions]);

  const handleSelect = (value: string) => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    if (selectedOptions.includes(value)) {
      onChange(selectedOptions.filter((el) => el !== value));
    } else {
      onChange([...selectedOptions, value]);
    }
  };

  const filterData = () => {
    const filteredData = options?.filter((el) => el.label.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())) || [];
    const checkedOptions = filteredData.filter((el) => selectedOptions.includes(el.value));
    const otherOptions = filteredData.filter((el) => !selectedOptions.includes(el.value));
    return [...checkedOptions, ...otherOptions];
  };

  useEffect(() => {
    if (!open) {
      setSortedData();
      setSearchValue("");
    }
  }, [open, setSortedData]);

  return (
    <Popper
      onAnimationStart={() => setOpen(true)}
      onAnimationExit={() => setOpen(false)}
      renderButton={(setReferenceElement, referenceElement) => (
        <TextField
          disabled={disabled}
          onChange={(value) => {
            if (open) {
              setSearchValue(value);
            }
          }}
          value={inputValue}
          placeholder={placeholder}
          className={cn("!h-9 w-full", selectedOptions.length > 0 && "[&>input]:bg-primary-main-100 [&>input]:!border-primary-main-400")}
          onClick={(e) => {
            setReferenceElement(referenceElement ? null : e.currentTarget);
          }}
          endIcon={
            <div className="flex items-center gap-2 h-full">
              <div
                className={cn(
                  "h-full flex items-center cursor-pointer",
                  selectedOptions.length > 0 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  if (selectedOptions.length > 0) {
                    onChange([]);
                  }
                }}
              >
                <MdClear className={cn("text-black size-3.5")} />
              </div>
              {open ? (
                <MdKeyboardArrowUp className={cn("cursor-pointer size-4")} />
              ) : (
                <MdKeyboardArrowDown className={cn("cursor-pointer size-4")} />
              )}
            </div>
          }
        />
      )}
      renderContent={() => (
        <AutoCompleteListBox className="w-full">
          {(open && searchValue ? filterData() : options)?.map((state) => (
            <CheckBox
              key={state.value}
              className="py-2.5 px-4 cursor-pointer hover:bg-primary-main-50 transition-all duration-100"
              label={state.label}
              onChange={() => handleSelect(state.value)}
              checked={selectedOptions.includes(state.value)}
            />
          ))}
        </AutoCompleteListBox>
      )}
    />
  );
};

export default MultiSelect;
