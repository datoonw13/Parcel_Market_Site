"use client";

import { Dispatch, SetStateAction, useState } from "react";
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
  placeholder?: string
}

const AutoComplete = <T extends Array<{}>>({
  options,
  getOptionKey,
  getOptionLabel,
  value,
  onChange,
  disableCloseOnSelect,
  onFilter,
  placeholder
}: AutoCompleteProps<T>) => {
  const [searchValue, setSearchValue] = useState<string | null>(null);

  const handleSelect = (item: typeof options[0], setReferenceElement: Dispatch<SetStateAction<HTMLElement | null>>) => {
    onChange(item);
    setSearchValue(null);
    if (!disableCloseOnSelect) {
      setReferenceElement(null);
    }
  };

  const getInputValue = (isOpen?: boolean) => {
    if (searchValue || isOpen) {
      return searchValue || "";
    }
    if (value) {
      return getOptionLabel(value);
    }
    return "";
  };

  const getOptions = () => {
    if (searchValue && onFilter) {
      return onFilter(searchValue, options);
    }
    return options;
  };

  return (
    <div>
      <Popper
        onExitComplete={() => setSearchValue && setSearchValue(null)}
        renderButton={(setReferenceElement, referenceElement) => (
          <TextField
            onChange={(value) => setSearchValue(value || null)}
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
              <AutoCompleteListItem key={getOptionKey(item)} onClick={() => handleSelect(item, setReferenceElement)}>
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
