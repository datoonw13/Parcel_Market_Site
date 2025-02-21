"use client";

import { NumberInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const VoltDetailsAcreageFilters = ({
  onChange,
  min,
  max,
  label,
  rootClassName,
  labelClassName,
  inputsWrapperClassName,
  inputClassName,
}: {
  onChange: (key: "min" | "max", value: number | null) => void;
  min: number | null;
  max: number | null;
  label?: string;
  rootClassName?: string;
  labelClassName?: string;
  inputsWrapperClassName?: string;
  inputClassName?: string;
}) => (
  <div className={cn("space-y-3", rootClassName)}>
    <h2 className={cn("text-black font-medium text-sm max-w-64", labelClassName)}>
      {label || "You can choose the desired Acreage Range."}
    </h2>
    <div className={cn("flex gap-1 items-center max-w-64", inputsWrapperClassName)}>
      <NumberInput
        value={min || ""}
        onValueChange={(e) => onChange("min", Number(e.value) || null)}
        rootClassName={cn("h-[38px]", inputClassName)}
        placeholder="Min"
      />
      <hr className="w-[8px] bg-grey-100 h-[1px]" />
      <NumberInput
        value={max || ""}
        onValueChange={(e) => onChange("max", Number(e.value) || null)}
        rootClassName={cn("h-[38px]", inputClassName)}
        placeholder="Max"
      />
    </div>
  </div>
);

export default VoltDetailsAcreageFilters;
