"use client";

import { Button } from "@/components/ui/button";
import { z } from "zod";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { FC, useState } from "react";
import { IoFilter } from "react-icons/io5";
import { MdArrowForwardIos } from "react-icons/md";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { PopoverClose } from "@radix-ui/react-popover";
import { UseFormReset, UseFormSetValue } from "react-hook-form";
import VoltDetailsFiltersDropDown from "./dropdown";
import VoltDetailsRadiusFilters from "./radius";
import VoltDetailsSoldWithinFilters from "./sold-within";
import VoltDetailsAcreageFilters from "./acreage";
import VoltDetailsPropertyTypeFilters from "./property-type";

interface IVoltDetailsTabletFilters {
  filters: {
    values: z.infer<typeof voltDetailsFiltersValidations>;
    setValue: UseFormSetValue<z.infer<typeof voltDetailsFiltersValidations>>;
    reset: UseFormReset<z.infer<typeof voltDetailsFiltersValidations>>;
    isDirty: boolean;
  };
  onSubmit: () => void;
  resetFilters: () => void;
  propertyTypes: Array<{ id: number; group: "vacant-land" | "other"; value: string }>;
  selectedFilters: number;
}

const VoltDetailsTabletFilters: FC<IVoltDetailsTabletFilters> = ({ filters, onSubmit, resetFilters, propertyTypes, selectedFilters }) => {
  const [showPropertyFilters, setPropertyFilter] = useState(false);
  const [propertyLocalFilter, setPropertyLocalFilter] = useState(filters.values.propertyTypes);
  const [backDrop, setBackDrop] = useState(false);

  return (
    <>
      <AnimatePresence>
        {backDrop && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.1 }}>
            <div className="fixed w-full h-full z-20 bg-black/70 left-0 top-0" />
          </motion.div>
        )}
      </AnimatePresence>
      <VoltDetailsFiltersDropDown
        buttonClassName="shadow-6"
        triggerClassName="z-20 relative max-w-sm"
        value={`${selectedFilters} Selected`}
        label="Filter"
        onToggle={setBackDrop}
        onClose={() => {
          resetFilters();
          setPropertyFilter(false);
        }}
        icon={<IoFilter />}
        renderContent={() => (
          <div className="flex flex-col justify-between h-full">
            <div className="bg-white py-5 space-y-5 rounded-t-2xl">
              <div className="px-5">
                <VoltDetailsRadiusFilters
                  value={filters.values.radius}
                  onChange={(radius) => {
                    filters.setValue("radius", radius, { shouldDirty: true, shouldValidate: true });
                  }}
                />
              </div>
              <div className="px-5">
                <VoltDetailsSoldWithinFilters
                  showLabel
                  value={filters.values.soldWithin}
                  onChange={(soldWithin) => {
                    filters.setValue("soldWithin", soldWithin, { shouldDirty: true, shouldValidate: true });
                  }}
                />
              </div>
              <div className="px-5">
                <VoltDetailsAcreageFilters
                  min={filters.values.acreageMin || null}
                  max={filters.values.acreageMax || null}
                  onChange={(key, value) => {
                    if (key === "min") {
                      filters.setValue("acreageMin", value, { shouldDirty: true, shouldValidate: true });
                    }
                    if (key === "max") {
                      filters.setValue("acreageMax", value, { shouldDirty: true, shouldValidate: true });
                    }
                  }}
                />
              </div>
              <div className="px-5">
                <div
                  onClick={() => {
                    setPropertyFilter(!showPropertyFilters);
                    setPropertyLocalFilter(filters.values.propertyTypes);
                  }}
                  className="border border-grey-100 bg-white px-3 py-2 flex justify-between items-center rounded-xl gap-4 cursor-pointer"
                >
                  <div>
                    <p className="text-start leading-none text-primary-main font-medium text-xs">
                      {`Selected (${
                        filters.values.propertyTypes?.length || propertyTypes.filter((el) => el.group === "vacant-land").length
                      })`}
                    </p>
                    <p className="text-start leading-none text-black font-medium text-sm pt-1">Property Type</p>
                  </div>
                  <MdArrowForwardIos className={cn("text-[#1E1E1E] transition-all")} />
                </div>
              </div>
            </div>
            <div className="p-4 grid grid-cols-[1fr_1.5fr] gap-4">
              <PopoverClose>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    resetFilters();
                  }}
                >
                  Clear
                </Button>
              </PopoverClose>
              <PopoverClose>
                <Button
                  disabled={!filters.isDirty}
                  className="w-full"
                  onClick={() => {
                    onSubmit();
                  }}
                >
                  Done
                </Button>
              </PopoverClose>
            </div>
          </div>
        )}
        renderContentAdditionalContent={
          showPropertyFilters
            ? (close) => (
                <>
                  {" "}
                  <div className="bg-white p-4 rounded-t-xl border-b border-b-grey-100">
                    <VoltDetailsPropertyTypeFilters
                      propertyTypes={propertyTypes}
                      onChange={(propertyTypes) => {
                        setPropertyLocalFilter(propertyTypes);
                      }}
                      selected={propertyLocalFilter}
                    />
                  </div>
                  <div className="px-4 py-3 flex justify-end gap-4">
                    <Button
                      className="w-full max-w-[150px]"
                      variant="secondary"
                      onClick={() => {
                        setPropertyFilter(false);
                        setPropertyLocalFilter(filters.values.propertyTypes);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      className="w-full max-w-[150px]"
                      onClick={() => {
                        setPropertyFilter(false);
                        filters.setValue("propertyTypes", propertyLocalFilter, { shouldDirty: true, shouldValidate: true });
                      }}
                    >
                      Done
                    </Button>
                  </div>
                </>
              )
            : undefined
        }
      />
    </>
  );
};

export default VoltDetailsTabletFilters;
