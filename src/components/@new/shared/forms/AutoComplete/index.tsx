"use client";

import { LoadingIcon1 } from "@/components/@new/icons/LoadingIcons";
import { Dispatch, ReactElement, SetStateAction, useRef, useState } from "react";
import { ArrowIconDown1, ArrowIconUp1 } from "@/components/@new/icons/ArrowIcons";
import clsx from "clsx";
import { Clear } from "@mui/icons-material";
import Popper from "../../Popper";
import AutoCompleteListBox from "./AutoCompleteListBox";
import AutoCompleteListItem from "./AutoCompleteListItem";
import TextField from "../TextField";

interface AutoCompleteProps<T extends Array<{}>> {
  options: T;
  getOptionLabel: (item: T[0]) => string;
  getOptionKey: (item: T[0]) => string;
  value?: T[0] | string | null;
  onChange: (item: T[0] | null) => void;
  disableCloseOnSelect?: boolean;
  onFilter?: (searchValue: string, items: T) => T;
  placeholder?: string;
  getSelectedOption?: (item: T[0], selectedValue?: T[0] | null) => boolean;
  inputRootClassName?: string;
  disabled?: boolean;
  clearIconClassName?: string;
  arrowIconClassName?: string;
  renderContent?: (setReferenceElement: Dispatch<SetStateAction<HTMLElement | null>>, options: T) => ReactElement;
  readOnly?: boolean;
  required?: boolean;
  error?: boolean;
  loading?: boolean;
  contentClassName?: string;
  disableSameWidth?: boolean
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
  inputRootClassName,
  disabled,
  clearIconClassName,
  arrowIconClassName,
  renderContent,
  readOnly,
  required,
  error,
  loading,
  contentClassName,
  disableSameWidth
}: AutoCompleteProps<T>) => {
  const [isOpen, setOpen] = useState(false);
  const isSearching = useRef(false);
  const [searchValue, setSearchValue] = useState<string | null>(null);

  const handleSelect = (item: typeof options[0], setReferenceElement: Dispatch<SetStateAction<HTMLElement | null>>) => {
    onChange(item);
    setOpen(!isOpen);
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
        disableSameWidth={disableSameWidth}
        offsetY={4}
        onAnimationExit={() => {
          setSearchValue(null);
          isSearching.current = false;
        }}
        onAnimationStart={() => {
          setOpen(!isOpen);
          if (value) {
            const el = document.getElementById(getOptionKey(value));
            if (el) {
              el.scrollIntoView();
            }
          }
        }}
        renderButton={(setReferenceElement, referenceElement) => (
          <TextField
            readOnly={readOnly}
            error={error}
            required={required}
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
            className={inputRootClassName}
            endIcon={
              <div className="flex items-center gap-2">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(null);
                  }}
                >
                  <Clear className={clsx("text-black !w-4 cursor-pointer", clearIconClassName, !value ? "opacity-0" : "opacity-100")} />
                </div>
                {isOpen ? (
                  <ArrowIconUp1 className={clsx("cursor-pointer h-2 mt-0.5", arrowIconClassName)} />
                ) : (
                  <ArrowIconDown1 className={clsx("cursor-pointer h-2 mt-0.5", arrowIconClassName)} />
                )}
                {loading && <LoadingIcon1 className="!h-3 !w-3" color="grey-600" />}
              </div>
            }
            disabled={disabled}
          />
        )}
        renderContent={(setReferenceElement) =>
          renderContent ? (
            renderContent(setReferenceElement, options)
          ) : (
            <AutoCompleteListBox>
              {getOptions().length === 0 && (
                <div className="py-4 px-4 cursor-pointer font-medium text-xs text-center">Data not found...</div>
              )}
              {getOptions().map((item) => (
                <AutoCompleteListItem
                  className={clsx(contentClassName)}
                  id={getOptionKey(item)}
                  selected={getSelectedOption ? getSelectedOption(item, value) : false}
                  key={getOptionKey(item)}
                  onClick={() => handleSelect(item, setReferenceElement)}
                >
                  {getOptionLabel(item)}
                </AutoCompleteListItem>
              ))}
            </AutoCompleteListBox>
          )
        }
      />
    </div>
  );
};

export default AutoComplete;
