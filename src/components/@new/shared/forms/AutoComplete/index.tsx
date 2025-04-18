/* eslint-disable no-nested-ternary */

"use client";

import { LoadingIcon1 } from "@/components/@new/icons/LoadingIcons";
import { Dispatch, ReactElement, SetStateAction, useRef, useState } from "react";
import { ArrowIconDown1, ArrowIconUp1 } from "@/components/@new/icons/ArrowIcons";
import clsx from "clsx";
import { Clear } from "@mui/icons-material";
import { TextInput } from "@/components/ui/input";
import Popper from "../../Popper";
import AutoCompleteListBox from "./AutoCompleteListBox";
import AutoCompleteListItem from "./AutoCompleteListItem";

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
  disableSameWidth?: boolean;
  rootClassName?: string;
  disableClear?: boolean;
  id?: string;
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
  disableSameWidth,
  rootClassName,
  disableClear,
  id,
}: AutoCompleteProps<T>) => {
  const [isOpen, setOpen] = useState(false);
  const isSearching = useRef(false);
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const ref = useRef<any>();

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

  const getOptions = (setReferenceElement: Dispatch<SetStateAction<HTMLElement | null>>) => {
    if (searchValue && onFilter && isSearching.current) {
      const filteredOptions = onFilter(searchValue, options);
      if (filteredOptions.length === 1) {
        const newValue = (filteredOptions[0] as any)?.value || filteredOptions[0];
        const currentValue = (value as any)?.value || value;
        if (newValue && JSON.stringify(newValue) !== JSON.stringify(currentValue)) {
          handleSelect(filteredOptions[0], setReferenceElement);
        }
      }
      return filteredOptions;
    }
    return options;
  };

  return (
    <div className={clsx(rootClassName)}>
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
          <TextInput
            ref={ref}
            id={id}
            readOnly={readOnly}
            error={error}
            required={required}
            onChange={(e) => {
              setSearchValue(e.target.value);
              if (!referenceElement) {
                setReferenceElement(ref.current as any);
              }
              isSearching.current = true;
            }}
            placeholder={placeholder}
            onClick={(e) => {
              setSearchValue(value ? getOptionLabel(value) : null);
              setReferenceElement(referenceElement ? null : (ref.current as any));
            }}
            value={getInputValue(!!referenceElement)}
            className={inputRootClassName}
            endIcon={
              <div className="flex items-center gap-2">
                {!disableClear && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(null);
                    }}
                  >
                    <Clear className={clsx("text-black !w-4 cursor-pointer", clearIconClassName, !value ? "opacity-0" : "opacity-100")} />
                  </div>
                )}
                {loading ? (
                  <LoadingIcon1 className="!h-3 !w-3" color="grey-600" />
                ) : isOpen ? (
                  <ArrowIconUp1 className={clsx("cursor-pointer h-2 mt-0.5", arrowIconClassName)} />
                ) : (
                  <ArrowIconDown1 className={clsx("cursor-pointer h-2 mt-0.5", arrowIconClassName)} />
                )}
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
              {getOptions(setReferenceElement).length === 0 && (
                <div className="py-4 px-4 cursor-pointer font-medium text-xs text-center">Data not found...</div>
              )}
              {getOptions(setReferenceElement).map((item) => (
                <AutoCompleteListItem
                  className={clsx(contentClassName, "w-full")}
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
