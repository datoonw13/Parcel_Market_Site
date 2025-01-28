"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { PropertyTypesEnum } from "@/types/volt-details";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { FC } from "react";
import { z } from "zod";

interface VoltDetailsPropertyTypeFiltersProps {
  selected: z.infer<typeof voltDetailsFiltersValidations>["propertyTypes"];
  onChange: (value: z.infer<typeof voltDetailsFiltersValidations>["propertyTypes"]) => void;
}

const VoltDetailsPropertyTypeFilters: FC<VoltDetailsPropertyTypeFiltersProps> = ({ onChange, selected }) => (
  <div className="grid grid-cols-3 gap-4">
    {Object.values(PropertyTypesEnum)
      .filter((el) => Number.isNaN(Number(el)))
      .map((type) => (
        <Checkbox
          onCheckedChange={() => {
            const isChecked = selected?.split(",")?.includes(PropertyTypesEnum[type as keyof typeof PropertyTypesEnum].toString());
            let newSelected: any = [...(selected?.split(",") || [])].map((el) => Number(el));
            if (isChecked) {
              newSelected = newSelected.filter(
                (el: any) => (el as PropertyTypesEnum) !== PropertyTypesEnum[type as keyof typeof PropertyTypesEnum]
              );
            } else {
              newSelected = [...newSelected, PropertyTypesEnum[type as keyof typeof PropertyTypesEnum]];
            }
            onChange(newSelected.length ? newSelected.join(",") : null);
          }}
          checked={!!selected?.split(",")?.includes(PropertyTypesEnum[type as keyof typeof PropertyTypesEnum].toString())}
          label={<span className="font-medium text-xs">{type}</span>}
          key={type}
          id={type.toString()}
        />
      ))}
  </div>
);

export default VoltDetailsPropertyTypeFilters;
