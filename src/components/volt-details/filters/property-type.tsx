"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { FC, useEffect } from "react";
import { boolean, z } from "zod";

interface VoltDetailsPropertyTypeFiltersProps {
  selected: z.infer<typeof voltDetailsFiltersValidations>["propertyTypes"];
  onChange: (value: z.infer<typeof voltDetailsFiltersValidations>["propertyTypes"]) => void;
  propertyTypes: Array<{ id: number; group: "vacant-land" | "other"; value: string }>;
  className?: string;
}

const VoltDetailsPropertyTypeFilters: FC<VoltDetailsPropertyTypeFiltersProps> = ({ onChange, selected, propertyTypes, className }) => {
  const filteredPropertyTypes = propertyTypes.filter((el) => el.group === "vacant-land");
  const filteredSelected = selected?.map((el) => filteredPropertyTypes.find((x) => x.id === el)?.id).filter(Boolean) || [];

  const selectAllState = () => {
    if (filteredSelected?.length === 0) {
      return false;
    }

    if (filteredPropertyTypes?.length === filteredSelected.length) {
      return true;
    }
    return "indeterminate";
  };

  const handleSelectAllChange = () => {
    if (selectAllState() === "indeterminate" || filteredSelected?.length === 0) {
      onChange(filteredPropertyTypes.map((el) => el.id));
    } else {
      onChange(null);
    }
  };

  useEffect(() => {
    if (filteredSelected?.length === 0) {
      onChange(filteredPropertyTypes.map((el) => el.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn("flex gap-16 h-96 overflow-hidden", className)}>
      <ScrollArea className="h-full [&>div>div:first-child]:h-full" id="volt-scroll">
        <div className="flex flex-col max-w-72">
          <p className="bg-white sticky top-0 z-10 mr-2 text-sm font-medium pb-2">Vacant Land</p>
          <div className="pr-1 flex flex-col gap-1">
            <Checkbox
              className="items-start [&>button]:mt-1"
              onCheckedChange={handleSelectAllChange}
              checked={selectAllState()}
              label={<span className="font-medium text-xs">Select All</span>}
              id="selectAll"
            />
            {filteredPropertyTypes.map((propertyType) => (
              <Checkbox
                className="items-start [&>button]:mt-1"
                onCheckedChange={() => {
                  const isChecked = filteredSelected?.includes(propertyType.id);
                  let newSelected: any = [...(filteredSelected || [])].map((el) => Number(el));
                  if (isChecked) {
                    newSelected = newSelected.filter((el: any) => el !== Number(propertyType.id));
                  } else {
                    newSelected = [...newSelected, propertyType.id];
                  }

                  if (!filteredSelected) {
                    newSelected = propertyTypes
                      .filter((el) => el.group === "vacant-land")
                      .filter((el) => el.id !== propertyType.id)
                      .map((el) => el.id);
                  }
                  onChange(newSelected.length ? newSelected : null);
                }}
                checked={!!filteredSelected?.includes(propertyType.id)}
                label={<span className="font-medium text-xs">{propertyType.value}</span>}
                key={propertyType.id}
                id={propertyType.id.toString()}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
      {/* <ScrollArea className="h-full [&>div>div:first-child]:h-full" id="volt-scroll">
        <div className="flex flex-col max-w-72">
          <p className="bg-white sticky top-0 z-10 mr-2 text-sm font-medium pb-2">Others</p>
          <div className="pr-1 flex flex-col gap-1">
            {propertyTypes
              .filter((el) => el.group === "other")
              .map((propertyType) => (
                <Checkbox
                  className="items-start [&>button]:mt-1"
                  onCheckedChange={() => {
                    const isChecked = selected?.includes(propertyType.id);
                    let newSelected: any = [...(selected || [])].map((el) => Number(el));
  
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
                    onChange(newSelected.length ? newSelected : null);
                  }}
                  checked={!!selected?.includes(propertyType.id)}
                  label={<span className="font-medium text-xs">{propertyType.value}</span>}
                  key={propertyType.id}
                  id={propertyType.id.toString()}
                />
              ))}
          </div>
        </div>
      </ScrollArea> */}
    </div>
  );
};

export default VoltDetailsPropertyTypeFilters;
