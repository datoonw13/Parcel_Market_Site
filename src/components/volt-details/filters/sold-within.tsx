"use client";

import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { FC } from "react";
import { z } from "zod";

interface VoltDetailsSoldWithinFiltersProps {
  value: z.infer<typeof voltDetailsFiltersValidations>["soldWithin"];
  onChange: (value: z.infer<typeof voltDetailsFiltersValidations>["soldWithin"]) => void;
  showLabel?: boolean;
}

const VoltDetailsSoldWithinFilters: FC<VoltDetailsSoldWithinFiltersProps> = ({ onChange, value, showLabel }) => (
  <div className="space-y-3">
    {showLabel && <h2 className="text-black font-medium text-sm">You can choose the desired Radius.</h2>}
    <div className="space-x-1.5">
      <span className="cursor-pointer">
        <input checked={value === 1} onChange={() => onChange(1)} id="sold-within-1" type="checkbox" className="hidden peer" />
        <label
          className="cursor-pointer font-medium text-xs border rounded-lg px-2 py-1.5 peer-checked:text-primary-main peer-checked:border-primary-main-400 peer-checked:bg-[#FAFFFB] transition-all"
          htmlFor="sold-within-1"
        >
          1 Year
        </label>
      </span>
      <span className="cursor-pointer">
        <input checked={value === 2} onChange={() => onChange(2)} id="sold-within-2" type="checkbox" className="hidden peer" />
        <label
          className="cursor-pointer font-medium text-xs border rounded-lg px-2 py-1.5 peer-checked:text-primary-main peer-checked:border-primary-main-400 peer-checked:bg-[#FAFFFB] transition-all"
          htmlFor="sold-within-2"
        >
          2 Year
        </label>
      </span>
      <span className="cursor-pointer">
        <input checked={value === 3} onChange={() => onChange(3)} id="sold-within-3" type="checkbox" className="hidden peer" />
        <label
          className="cursor-pointer font-medium text-xs border rounded-lg px-2 py-1.5 peer-checked:text-primary-main peer-checked:border-primary-main-400 peer-checked:bg-[#FAFFFB] transition-all"
          htmlFor="sold-within-3"
        >
          3 Year
        </label>
      </span>
    </div>
  </div>
);

export default VoltDetailsSoldWithinFilters;
