"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Command as CommandPrimitive } from "cmdk";

import { cn } from "@/lib/utils";
import { FC, useEffect, useRef, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "./command";
import { TextInput as Input } from "./input";
import { Popover, PopoverContent } from "./popover";
import { ScrollArea } from "./scroll-area";

export type Option = Record<"value" | "label", string> & Record<string, string>;

type AutoCompleteProps = {
  options: Option[];
  selectedValue?: string | null;
  onValueChange: (value: string | null) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  error?: boolean;
  inputRootClassName?: string;
  clearable?: boolean;
  id?: string;
};

const AutoComplete: FC<AutoCompleteProps> = ({
  options,
  disabled,
  isLoading,
  onValueChange,
  placeholder,
  selectedValue,
  error,
  inputRootClassName,
  clearable,
  id,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [contentWidth, setContentWidth] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleResize = () => {
    const inputRootEl = inputRef.current?.parentElement?.parentElement;
    if (inputRootEl) {
      setContentWidth(inputRootEl.getBoundingClientRect().width);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // useEffect(() => {
  //   setSearch(options.find((option) => option.value === selectedValue)?.label || "");
  // }, [options, selectedValue]);

  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Command
        filter={(value, key) => {
          const item = options.find((el) => el.value === value);
          return item?.label.trim().toLocaleLowerCase().includes(key.trim().toLocaleLowerCase()) ? 1 : 0;
        }}
      >
        <PopoverPrimitive.Anchor>
          <CommandPrimitive.Input
            id={id}
            asChild
            disabled={disabled}
            className="w-full"
            onValueChange={(search) => {
              setSearch(search);

              const filteredOptions = options.filter((item) =>
                item?.label.trim().toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())
              );

              if (filteredOptions.length === 1 && selectedValue !== filteredOptions[0].value) {
                onValueChange(filteredOptions[0].value);
                // setSearch(filteredOptions[0].label);
                setOpen(false);
              }
            }}
            onKeyDown={(e) => setOpen(e.key !== "Escape")}
            onMouseDown={() => setOpen((open) => !!search || !open)}
            onFocus={(e) => {
              setOpen(true);
            }}
            onBlur={(e) => {
              if (!e.relatedTarget?.hasAttribute("cmdk-list")) {
                // setSearch(
                //   selectedValue
                //     ? options.find((option) => option.value.toLocaleLowerCase() === selectedValue.toLocaleLowerCase())?.label ?? ""
                //     : ""
                // );
              }
              setOpen(false);
            }}
            value={search || ""}
          >
            <Input
              endIcon={
                <>
                  <div className="flex items-center">
                    {clearable && selectedValue && (
                      <IoMdClose
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onValueChange(null);
                          // setSearch("");
                        }}
                      />
                    )}
                    {open ? <IoChevronUp /> : <IoChevronDown />}
                  </div>
                </>
              }
              error={error}
              value={open ? search : options.find((el) => el.value === selectedValue)?.label || ""}
              rootClassName={cn(
                "w-full",
                inputRootClassName,
                open && "[&>.end-icon]:!pointer-events-none [&>.start-icon]:!pointer-events-none"
              )}
              ref={inputRef}
              placeholder={placeholder || ""}
              className=""
            />
          </CommandPrimitive.Input>
        </PopoverPrimitive.Anchor>
        {!open && <CommandList aria-hidden="true" className="hidden" />}
        <PopoverContent
          asChild
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            if (e.target instanceof Element && e.target.hasAttribute("cmdk-input")) {
              e.preventDefault();
            }
          }}
          style={{ width: contentWidth }}
          className="min-w-[calc(--radix-popover-trigger-width)] p-0 border-0 shadow-4 rounded-lg overflow-hidden"
        >
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            className="overflow-hidden flex w-full"
            variants={{
              open: { opacity: 1 },
              collapsed: { opacity: 0 },
            }}
            transition={{ duration: 0.1 }}
            onAnimationStart={() => {
              document?.querySelector(`[data-value=${selectedValue}]`)?.scrollIntoView();
            }}
          >
            <ScrollArea className="max-h-72 w-full">
              <CommandList className="overflow-hidden">
                <CommandEmpty className="bg-white p-4 text-sm">No results...</CommandEmpty>
                <CommandGroup value="" className="bg-white border-0 shadow-0 outline-0 p-0 m-0 overflow-hidden">
                  {options.map((option) => (
                    <CommandItem
                      id={option.value}
                      key={option.value}
                      value={option.value}
                      onMouseDown={(e) => e.preventDefault()}
                      onSelect={(currentValue) => {
                        onValueChange(currentValue);
                        // setSearch(options.find((option) => option.value === currentValue)?.label || "");
                        setOpen(false);
                      }}
                      className={cn("text-xs", selectedValue === option.value ? "!bg-primary-main-100 " : "hover:!bg-primary-main-50")}
                    >
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </ScrollArea>
          </motion.div>
        </PopoverContent>
      </Command>
    </Popover>
  );
};

export { AutoComplete };
