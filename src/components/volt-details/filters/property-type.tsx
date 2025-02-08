"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PropertyTypesEnum } from "@/types/volt-details";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { FC } from "react";
import { z } from "zod";

interface VoltDetailsPropertyTypeFiltersProps {
  selected: z.infer<typeof voltDetailsFiltersValidations>["propertyTypes"];
  onChange: (value: z.infer<typeof voltDetailsFiltersValidations>["propertyTypes"]) => void;
  propertyTypes: Array<{ id: number; group: "vacant-land" | "other"; value: string }>;
}

const VoltDetailsPropertyTypeFilters: FC<VoltDetailsPropertyTypeFiltersProps> = ({ onChange, selected, propertyTypes }) => (
  <div className="flex gap-16 h-96 overflow-hidden">
    <ScrollArea className="h-full [&>div>div:first-child]:h-full" id="volt-scroll">
      <div className="flex flex-col max-w-72">
        <p className="bg-white sticky top-0 z-10 mr-2 text-sm font-medium pb-2">Vacant Land</p>
        <div className="pr-1 flex flex-col gap-1">
          {propertyTypes
            .filter((el) => el.group === "vacant-land")
            .map((propertyType) => (
              <Checkbox
                className="items-start [&>button]:mt-1"
                onCheckedChange={() => {
                  const isChecked = selected?.split(",")?.includes(propertyType.id.toString());
                  let newSelected: any = [...(selected?.split(",") || [])].map((el) => Number(el));
                  if (isChecked) {
                    newSelected = newSelected.filter((el: any) => el !== Number(propertyType.id));
                  } else {
                    newSelected = [...newSelected, propertyType.id];
                  }

                  if (!selected) {
                    newSelected = propertyTypes
                      .filter((el) => el.group === "vacant-land")
                      .filter((el) => el.id !== propertyType.id)
                      .map((el) => el.id);
                  }
                  onChange(newSelected.length ? newSelected.join(",") : null);
                }}
                checked={!!selected?.split(",")?.includes(propertyType.id.toString()) || selected?.length === 0 || !selected}
                label={<span className="font-medium text-xs">{propertyType.value}</span>}
                key={propertyType.id}
                id={propertyType.id.toString()}
              />
            ))}
        </div>
      </div>
    </ScrollArea>
    <ScrollArea className="h-full [&>div>div:first-child]:h-full" id="volt-scroll">
      <div className="flex flex-col max-w-72">
        <p className="bg-white sticky top-0 z-10 mr-2 text-sm font-medium pb-2">Others</p>
        <div className="pr-1 flex flex-col gap-1">
          {propertyTypes
            .filter((el) => el.group === "other")
            .map((propertyType) => (
              <Checkbox
                className="items-start [&>button]:mt-1"
                onCheckedChange={() => {
                  const isChecked = selected?.split(",")?.includes(propertyType.id.toString());
                  let newSelected: any = [...(selected?.split(",") || [])].map((el) => Number(el));

                  if (!selected) {
                    newSelected = propertyTypes
                      .filter((el) => el.group === "vacant-land")
                      .filter((el) => el.id !== propertyType.id)
                      .map((el) => el.id);
                  }

                  if (isChecked) {
                    newSelected = newSelected.filter((el: any) => el !== Number(propertyType.id));
                  } else {
                    newSelected = [...newSelected, propertyType.id];
                  }
                  onChange(newSelected.length ? newSelected.join(",") : null);
                }}
                checked={!!selected?.split(",")?.includes(propertyType.id.toString())}
                label={<span className="font-medium text-xs">{propertyType.value}</span>}
                key={propertyType.id}
                id={propertyType.id.toString()}
              />
            ))}
        </div>
      </div>
    </ScrollArea>
  </div>
);

export default VoltDetailsPropertyTypeFilters;
