"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { FaCheck } from "react-icons/fa";

import { cn } from "@/lib/utils";
import { RiCheckboxIndeterminateFill } from "react-icons/ri";
import { MdOutlineHorizontalRule } from "react-icons/md";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & { label?: string | React.ReactNode; id?: string; labelClassName?: string }
>(({ className, label, id, labelClassName, ...props }, ref) => (
  <div className={cn("flex items-center space-x-2 relative", className)}>
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "group peer h-4 w-4 shrink-0 rounded-sm border border-grey-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary-main data-[state=checked]:text-white data-[state=indeterminate]:bg-primary-main data-[state=indeterminate]:text-white"
      )}
      {...props}
      id={id}
    >
      <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
        <FaCheck className="h-2 w-2 hidden group-data-[state=checked]:block" />
        <MdOutlineHorizontalRule className="h-3 w-3 hidden group-data-[state=indeterminate]:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
    {label && (
      <label
        htmlFor={id}
        className={cn(
          "leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 after:content-[''] after:cursor-pointer after:absolute after:w-full after:left-0 after:h-full after:top-0",
          labelClassName
        )}
      >
        {label}
      </label>
    )}
  </div>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
