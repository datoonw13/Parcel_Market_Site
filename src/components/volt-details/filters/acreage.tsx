"use client";

import { NumberInput } from "@/components/ui/input";

const VoltDetailsAcreageFilters = ({
  onChange,
  min,
  max,
}: {
  onChange: (key: "min" | "max", value: number | null) => void;
  min: number | null;
  max: number | null;
}) => (
  <div className="space-y-3">
    <h2 className="text-black font-medium text-sm max-w-64">You can choose the desired Acreage Range.</h2>
    <div className="flex gap-1 items-center max-w-64">
      <NumberInput
        value={min || ""}
        onValueChange={(e) => onChange("min", Number(e.value) || null)}
        rootClassName="h-[38px]"
        placeholder="Min"
      />
      <hr className="w-[8px] bg-grey-100 h-[1px]" />
      <NumberInput
        value={max || ""}
        onValueChange={(e) => onChange("max", Number(e.value) || null)}
        rootClassName="h-[38px]"
        placeholder="Max"
      />
    </div>
  </div>
);

export default VoltDetailsAcreageFilters;
