"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Popper from "../../Popper";
import AutoCompleteListBox from "./AutoCompleteListBox";
import AutoCompleteListItem from "./AutoCompleteListItem";
import TextField from "../TextField";

interface AutoCompleteProps<T extends Array<{}>> {
  options: T;
  getOptionLabel: (item: T[0]) => string;
  getOptionKey: (item: T[0]) => string;
  value?: T[0] | null;
  onChange: (item: T[0]) => void;
  disableCloseOnSelect?: boolean;
  onFilter?: (searchValue: string, items: T) => T;
  placeholder?: string;
  getSelectedOption?: (item: T[0], selectedValue?: T[0] | null) => boolean;
}

const AutoComplete = <T extends Array<{}>>({
  options,
  getOptionKey,
  getOptionLabel,
  value,
  onChange,
  disableCloseOnSelect,
  onFilter,
  placeholder,
  getSelectedOption,
}: AutoCompleteProps<T>) => {
  const isSearching = useRef(false);
  const [searchValue, setSearchValue] = useState<string | null>(null);

  const handleSelect = (item: typeof options[0], setReferenceElement: Dispatch<SetStateAction<HTMLElement | null>>) => {
    onChange(item);
    if (!disableCloseOnSelect) {
      setReferenceElement(null);
    }
  };

  const getInputValue = (isOpen?: boolean) => {
    if (isOpen && isSearching.current) {
      return searchValue || "";
    }
    if (value) {
      return getOptionLabel(value);
    }
    return "";
  };

  const getOptions = () => {
    if (searchValue && onFilter && isSearching.current) {
      return onFilter(searchValue, options);
    }
    return options;
  };

  return (
    <div>
      <Popper
        onAnimationExit={() => {
          setSearchValue(null);
          isSearching.current = false;
        }}
        onAnimationStart={() => {
          if (value) {
            const el = document.getElementById(getOptionKey(value));
            if (el) {
              el.scrollIntoView();
            }
          }
        }}
        renderButton={(setReferenceElement, referenceElement) => (
          <TextField
            onChange={(value) => {
              setSearchValue(value);
              isSearching.current = true;
            }}
            placeholder={placeholder}
            onClick={(e) => {
              setSearchValue(value ? getOptionLabel(value) : null);
              setReferenceElement(referenceElement ? null : e.currentTarget);
            }}
            value={getInputValue(!!referenceElement)}
          />
        )}
        renderContent={(setReferenceElement) => (
          <AutoCompleteListBox>
            {getOptions().length === 0 && <div className="py-4 px-4 cursor-pointer font-medium text-xs text-center">Data not found...</div>}
            {getOptions().map((item) => (
              <AutoCompleteListItem
                id={getOptionKey(item)}
                selected={getSelectedOption ? getSelectedOption(item, value) : false}
                key={getOptionKey(item)}
                onClick={() => handleSelect(item, setReferenceElement)}
              >
                {getOptionLabel(item)}
              </AutoCompleteListItem>
            ))}
          </AutoCompleteListBox>
        )}
      />
    </div>
  );
};

export default AutoComplete;
