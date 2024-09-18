"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { ComponentPropsWithoutRef, ElementRef, ReactElement, forwardRef } from "react";
import { FaCircle } from "react-icons/fa";
import { cn } from "../../lib/utils";
import { Label } from "./label";

interface RadioGroupItemProps extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label?: ReactElement | string;
  labelClassName?: string;
}

const RadioGroup = forwardRef<ElementRef<typeof RadioGroupPrimitive.Root>, ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>>(
  ({ className, ...props }, ref) => <RadioGroupPrimitive.Root className={cn("grid gap-2", className)} {...props} ref={ref} />
);
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = forwardRef<ElementRef<typeof RadioGroupPrimitive.Item>, RadioGroupItemProps>(({ className, ...props }, ref) => (
  <div className="flex items-center">
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        `
        aspect-square h-4 w-4 rounded-full border border-grey-200
        [&:has([data-state=checked])]:border-success
        [&:has([data-state=checked])]:text-success
        `,
        className
      )}
      {...props}
      id={props.value}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <FaCircle className="h-2 w-2 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
    {props.label && (
      <Label htmlFor={props.value} className={cn("pl-2", props.labelClassName)}>
        {props.label}
      </Label>
    )}
  </div>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
