"use client";

import { Command as CommandPrimitive } from "cmdk";
import { useState, useRef, useCallback } from "react";
import type { KeyboardEvent } from "react";

import { cn } from "@/lib/utils";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { ScrollArea } from "./scroll-area";
import { Skeleton } from "./skeleton";

import { CommandItem, CommandList } from "./command";
import { TextInput } from "./input";

export type Option = Record<"value" | "label", string> & Record<string, string>;

type AutoCompleteProps = {
  options: Option[];
  emptyMessage: string;
  value: Option | null;
  onValueChange?: (value: Option) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
};

export const AutoComplete = ({
  options,
  placeholder,
  emptyMessage,
  value,
  onValueChange,
  disabled,
  isLoading = false,
}: AutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>(value?.label || "");

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      // Keep the options displayed when the user is typing
      if (!isOpen) {
        setOpen(true);
      }

      // This is not a default behaviour of the <input /> field
      if (event.key === "Enter" && input.value !== "") {
        const optionToSelect = options.find((option) => option.label === input.value);
        if (optionToSelect) {
          onValueChange?.(optionToSelect);
        }
      }

      if (event.key === "Escape") {
        input.blur();
      }
    },
    [isOpen, options, onValueChange]
  );

  const handleBlur = useCallback(() => {
    setOpen(false);
    setInputValue(value?.label || "");
  }, [value]);

  const handleSelectOption = useCallback(
    (selectedOption: Option) => {
      setInputValue(selectedOption.label);
      onValueChange?.(selectedOption);

      // This is a hack to prevent the input from being focused after the user selects an option
      // We can call this hack: "The next tick"
      setTimeout(() => {
        inputRef?.current?.blur();
      }, 0);
    },
    [onValueChange]
  );

  const filterOptions = () => {
    if (inputValue) {
      const filteredOptions = options.filter((el) => el.label.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase()));
      return filteredOptions;
    }
    return options;
  };

  const filteredOptions = filterOptions();

  return (
    <CommandPrimitive onKeyDown={handleKeyDown}>
      <div>
        <TextInput
          ref={inputRef}
          value={inputValue || ""}
          onChange={(e) => (isLoading ? undefined : setInputValue(e.target.value))}
          onBlur={handleBlur}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          endIcon={isOpen ? <IoChevronUp className="size-4 text-grey-800" /> : <IoChevronDown className="size-4 text-grey-800" />}
        />
      </div>
      <div className="relative mt-1">
        <div
          className={cn(
            "animate-in fade-in-0 zoom-in-95 absolute top-0 z-10 w-full rounded-xl bg-white outline-none shadow-1 overflow-hidden",
            isOpen ? "block" : "hidden"
          )}
        >
          <CommandList className="overflow-hidden">
            {isLoading ? (
              <CommandPrimitive.Loading>
                <div className="p-1">
                  <Skeleton className="h-8 w-full" />
                </div>
              </CommandPrimitive.Loading>
            ) : null}
            {filteredOptions.length > 0 && !isLoading && (
              <ScrollArea className="flex max-h-72 flex-col overflow-y-auto">
                {filteredOptions.map((option) => {
                  const isSelected = value?.value === option.value;
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      onSelect={() => handleSelectOption(option)}
                      className={cn(
                        "py-2.5 px-4 cursor-pointer hover:!bg-primary-main-50 transition-all duration-100 font-medium text-xs",
                        isSelected && "!bg-primary-main-100"
                      )}
                    >
                      {option.label}
                    </CommandItem>
                  );
                })}
              </ScrollArea>
            )}
            {!isLoading ? (
              <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">
                {emptyMessage}
              </CommandPrimitive.Empty>
            ) : null}
          </CommandList>
        </div>
      </div>
    </CommandPrimitive>
  );
};
