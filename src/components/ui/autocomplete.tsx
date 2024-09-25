"use client";

import { Command as CommandPrimitive } from "cmdk";
import { useState, useRef, useCallback, useEffect } from "react";
import type { KeyboardEvent } from "react";

import { cn } from "@/lib/utils";
import { IoChevronDown, IoChevronUp, IoClose } from "react-icons/io5";
import { ScrollArea } from "./scroll-area";
import { Skeleton } from "./skeleton";

import { CommandItem, CommandList } from "./command";
import { TextInput } from "./input";
import { Button } from "./button";

export type Option = Record<"value" | "label", string> & Record<string, string>;

type AutoCompleteProps = {
  options: Option[];
  emptyMessage: string;
  value: Option | null;
  onValueChange?: (value: Option | null) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  error?: boolean;
};

export const AutoComplete = ({
  options,
  placeholder,
  emptyMessage,
  value,
  onValueChange,
  disabled,
  isLoading,
  error,
}: AutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputRootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
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
    (selectedOption: Option | null) => {
      setInputValue(selectedOption?.label || "");
      onValueChange?.(selectedOption);

      // This is a hack to prevent the input from being focused after the user selects an option
      // We can call this hack: "The next tick"
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
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

  const updateContainerOptions = () => {
    if (inputRef.current && containerRef.current) {
      const props = inputRootRef.current!.getBoundingClientRect();
      containerRef.current.style.top = `${props.y + props.height + 2}px`;
      containerRef.current.style.width = `${props.width}px`;
    }
  };

  useEffect(
    () => () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    },
    []
  );

  useEffect(() => {
    if (!isOpen && value?.label !== inputValue) {
      setInputValue(value?.label || "");
    }
  }, [inputValue, isOpen, value?.label]);

  useEffect(() => {
    updateContainerOptions();
  }, [inputValue]);

  useEffect(() => {
    window.addEventListener("resize", updateContainerOptions);
    return () => {
      window.removeEventListener("resize", updateContainerOptions);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("wheel", updateContainerOptions);
    return () => {
      window.removeEventListener("wheel", updateContainerOptions);
    };
  }, []);

  return (
    <CommandPrimitive onKeyDown={handleKeyDown} className="w-full">
      <div>
        <TextInput
          ref={inputRef}
          rootRef={inputRootRef}
          value={inputValue || ""}
          onChange={(e) => (isLoading ? undefined : setInputValue(e.target.value))}
          onBlur={handleBlur}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          error={error}
          endIcon={
            <div className="grid gap-1 h-full items-center grid-cols-[minmax(0,_max-content)_minmax(0,_max-content)]">
              {value && (
                <Button onClick={() => handleSelectOption(null)} size="icon" className="h-full w-full px-1 !bg-transparent">
                  <IoClose className="size-4 text-grey-800" />
                </Button>
              )}
              <Button size="icon" className="h-full w-full px-1 !bg-transparent">
                {isOpen ? <IoChevronUp className="size-4 text-grey-800" /> : <IoChevronDown className="size-4 text-grey-800" />}
              </Button>
            </div>
          }
          rootClassName="w-full"
        />
      </div>
      <div className="relative mt-1">
        <div
          className={cn(
            "animate-in fade-in-0 zoom-in-95 fixed top-0 z-10 w-full rounded-xl bg-white outline-none shadow-1 overflow-hidden",
            isOpen ? "block" : "hidden"
          )}
          ref={containerRef}
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
