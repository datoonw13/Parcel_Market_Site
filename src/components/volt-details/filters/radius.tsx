"use client";

import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { FC } from "react";
import { z } from "zod";

interface VoltDetailsRadiusFiltersProps {
  value: z.infer<typeof voltDetailsFiltersValidations>["radius"];
  onChange: (value: z.infer<typeof voltDetailsFiltersValidations>["radius"]) => void;
}

const VoltDetailsRadiusFilters: FC<VoltDetailsRadiusFiltersProps> = ({ value, onChange }) => (
  <div className="space-y-3">
    <h2 className="text-black font-medium text-sm">Radial distance from Subject</h2>
    <div className="space-x-1.5">
      <span className="cursor-pointer">
        <input id="mile-5" type="checkbox" checked={value === 5} onChange={() => onChange(5)} className="hidden peer" />
        <label
          className="cursor-pointer font-medium text-xs border rounded-lg px-2 py-1.5 peer-checked:text-primary-main peer-checked:border-primary-main-400 peer-checked:bg-[#FAFFFB] transition-all"
          htmlFor="mile-5"
        >
          5 Mile
        </label>
      </span>
      <span className="cursor-pointer">
        <input id="mile-10" type="checkbox" checked={value === 10} onChange={() => onChange(10)} className="hidden peer" />
        <label
          className="cursor-pointer font-medium text-xs border rounded-lg px-2 py-1.5 peer-checked:text-primary-main peer-checked:border-primary-main-400 peer-checked:bg-[#FAFFFB] transition-all"
          htmlFor="mile-10"
        >
          10 Mile
        </label>
      </span>
      <span className="cursor-pointer">
        <input id="mile-15" type="checkbox" checked={value === 15} onChange={() => onChange(15)} className="hidden peer" />
        <label
          className="cursor-pointer font-medium text-xs border rounded-lg px-2 py-1.5 peer-checked:text-primary-main peer-checked:border-primary-main-400 peer-checked:bg-[#FAFFFB] transition-all"
          htmlFor="mile-15"
        >
          15 Mile
        </label>
      </span>
    </div>
  </div>
);

export default VoltDetailsRadiusFilters;
