"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Command as CommandPrimitive } from "cmdk";

import { cn } from "@/lib/utils";
import { FC, memo, useEffect, useMemo, useRef, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "./command";
import { TextInput as Input } from "./input";
import { Popover, PopoverContent } from "./popover";
import { ScrollArea } from "./scroll-area";

export type Option = Record<"value" | "label", string> & Record<string, string>;

type AutoCompleteMultiProps = {
  options: Option[];
  onValueChange: (value: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
  error?: boolean;
  inputRootClassName?: string;
  clearable?: boolean;
  selectedValues: string[];
};

const AutoCompleteMulti: FC<AutoCompleteMultiProps> = ({
  options,
  disabled,
  onValueChange,
  placeholder,
  error,
  inputRootClassName,
  clearable,
  selectedValues,
}) => {
  const isMounted = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [contentWidth, setContentWidth] = useState(0);
  const [data, setData] = useState(options);
  const [selectedValuesLocal, setSelectedValuesLocal] = useState<Option[]>([]);

  const checkedOptions = useMemo(
    () => options.filter((el) => selectedValuesLocal.find((x) => x.value === el.value)),
    [options, selectedValuesLocal]
  );
  const uncheckedOptions = useMemo(
    () => options.filter((el) => !selectedValuesLocal.find((x) => x.value === el.value)),
    [options, selectedValuesLocal]
  );

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

  useEffect(() => {
    if (!open) {
      setSearch("");
      setData([...checkedOptions, ...uncheckedOptions]);
    }
  }, [checkedOptions, open, uncheckedOptions]);

  useEffect(
    () => () => {
      window.clearTimeout(timerRef.current);
    },
    []
  );

  useEffect(() => {
    if (!open) {
      setSelectedValuesLocal(
        selectedValues.map((el) => {
          const item = options.find((x) => x.value === el);
          return {
            value: item?.value || "",
            label: item?.label || "",
          };
        })
      );
      isMounted.current = true;
    }
  }, [selectedValues, open, options]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Command
        filter={(value) => {
          const item = data.find((el) => el.value === value);
          return item?.label.trim().toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()) ? 1 : 0;
        }}
      >
        <PopoverPrimitive.Anchor>
          <CommandPrimitive.Input
            asChild
            disabled={disabled}
            className="w-full"
            onValueChange={(search) => {
              setSearch(search);
            }}
            onKeyDown={(e) => setOpen(e.key !== "Escape")}
            onMouseDown={() => setOpen((open) => !!search || !open)}
            onFocus={(e) => {
              setOpen(true);
            }}
            onBlur={(e) => {
              setOpen(false);
            }}
          >
            <Input
              endIcon={
                <>
                  <div className="flex items-center">
                    {clearable && selectedValuesLocal.length > 0 && (
                      <IoMdClose
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedValuesLocal([]);
                          onValueChange([]);
                        }}
                      />
                    )}
                    {open ? <IoChevronUp /> : <IoChevronDown />}
                  </div>
                </>
              }
              error={error}
              value={open ? search : selectedValuesLocal.map((el) => el.label).join(";")}
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
          >
            <ScrollArea className="max-h-72 w-full">
              <CommandList className="overflow-hidden">
                <CommandEmpty className="bg-white p-4 text-sm">No results...</CommandEmpty>
                <CommandGroup value="" className="bg-white border-0 shadow-0 outline-0 p-0 m-0 overflow-hidden">
                  {data.map((option) => (
                    <CommandItem
                      id={option.value}
                      key={option.value}
                      value={option.value}
                      onMouseDown={(e) => e.preventDefault()}
                      onSelect={(currentValue) => {
                        let newValues = [...selectedValuesLocal];
                        const isSelected = newValues.find((el) => el.value === currentValue);
                        if (isSelected) {
                          newValues = newValues.filter((el) => el.value !== currentValue);
                        } else {
                          const item = options.find((el) => el.value === currentValue);
                          if (item) {
                            newValues = [...newValues, item];
                          }
                        }
                        setSelectedValuesLocal(newValues);
                        window.clearTimeout(timerRef.current);
                        timerRef.current = setTimeout(() => {
                          onValueChange(newValues.map((el) => el.value));
                        }, 300);
                      }}
                      className={cn(
                        "text-xs",
                        selectedValuesLocal.find(({ value }) => value === option.value)
                          ? "!bg-primary-main-100 "
                          : "hover:!bg-primary-main-50"
                      )}
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

export default memo(AutoCompleteMulti);
