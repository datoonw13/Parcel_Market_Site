"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { PropertyTypesEnum } from "@/types/volt-details";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { FC } from "react";
import { z } from "zod";

interface VoltDetailsPropertyTypeFiltersProps {
  selected: z.infer<typeof voltDetailsFiltersValidations>["propertyTypes"];
  onChange: (value: z.infer<typeof voltDetailsFiltersValidations>["propertyTypes"]) => void;
  propertyTypes: { [key: string]: string };
}

const VoltDetailsPropertyTypeFilters: FC<VoltDetailsPropertyTypeFiltersProps> = ({ onChange, selected, propertyTypes }) => (
  <div className="grid grid-cols-3 gap-4">
    {Object.keys(propertyTypes).map((key) => (
      <Checkbox
        onCheckedChange={() => {
          const isChecked = selected?.split(",")?.includes(key.toString());
          let newSelected: any = [...(selected?.split(",") || [])].map((el) => Number(el));

          if (isChecked) {
            newSelected = newSelected.filter((el: any) => el !== key);
          } else {
            newSelected = [...newSelected, key];
          }
          onChange(newSelected.length ? newSelected.join(",") : null);
        }}
        checked={!!selected?.split(",")?.includes(key.toString())}
        label={<span className="font-medium text-xs">{propertyTypes[key]}</span>}
        key={key}
        id={key.toString()}
      />
    ))}
  </div>
);

export default VoltDetailsPropertyTypeFilters;
