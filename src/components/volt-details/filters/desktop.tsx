"use client";

import { Button } from "@/components/ui/button";
import { z } from "zod";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { FC, useEffect, useRef, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { AnimatePresence, motion } from "framer-motion";
import { PopoverClose } from "@radix-ui/react-popover";
import { UseFormReset, UseFormSetValue } from "react-hook-form";
import VoltDetailsFiltersDropDown from "./dropdown";
import VoltDetailsRadiusFilters from "./radius";
import VoltDetailsSoldWithinFilters from "./sold-within";
import VoltDetailsAcreageFilters from "./acreage";
import VoltDetailsPropertyTypeFilters from "./property-type";

interface IVoltDetailsDesktopFilters {
  filters: {
    values: z.infer<typeof voltDetailsFiltersValidations>;
    setValue: UseFormSetValue<z.infer<typeof voltDetailsFiltersValidations>>;
    reset: UseFormReset<z.infer<typeof voltDetailsFiltersValidations>>;
    isDirty: boolean;
  };
  onSubmit: () => void;
  propertyTypes: Array<{ id: number; group: "vacant-land" | "other"; value: string }>;
}

const getAcreageLabel = (min: number | null, max: number | null) => {
  if (min && !max) {
    return `[${min}, N/A]`;
  }
  if (!min && max) {
    return `[N/A, ${max}]`;
  }
  if (min && max) {
    return `[${min}, ${max}]`;
  }
  return "N/A";
};

const VoltDetailsDesktopFilters: FC<IVoltDetailsDesktopFilters> = ({ filters, onSubmit, propertyTypes }) => {
  const [localFilters, setLocalFilters] = useState(filters.values);
  const [backDrop, setBackDrop] = useState(false);
  const [animateButton, setAnimateButton] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setLocalFilters(filters.values);
  }, [filters]);

  useEffect(() => {
    if (filters.isDirty) {
      window.clearTimeout(timerRef.current);
      setAnimateButton(true);
      timerRef.current = setTimeout(() => {
        setAnimateButton(false);
      }, 600);
    }

    return () => {
      window.clearTimeout(timerRef.current);
    };
  }, [filters.isDirty]);

  return (
    <>
      <AnimatePresence>
        {backDrop && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.1 }}>
            <div className="fixed w-full h-full z-20 bg-black/70 left-0 top-0" />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex gap-2 z-20 relative">
        <VoltDetailsFiltersDropDown
          buttonClassName="shadow-6 border-0"
          onToggle={setBackDrop}
          value={`${filters.values.radius} Mile`}
          label="Radius"
          onClose={() => {
            setLocalFilters((prev) => ({ ...prev, radius: filters.values.radius }));
          }}
          renderContent={() => (
            <>
              <div className="bg-grey-30 p-4 rounded-t-xl border-b border-b-grey-100">
                <VoltDetailsRadiusFilters
                  value={localFilters.radius}
                  onChange={(radius) => setLocalFilters((prev) => ({ ...prev, radius }))}
                />
              </div>
              <div className="px-4 py-3">
                <PopoverClose className="w-full">
                  <Button
                    className="w-full"
                    onClick={() => {
                      filters.setValue("radius", localFilters.radius, { shouldDirty: true, shouldValidate: true });
                    }}
                  >
                    Done
                  </Button>
                </PopoverClose>
              </div>
            </>
          )}
        />
        <VoltDetailsFiltersDropDown
          buttonClassName="shadow-6 border-0"
          onToggle={setBackDrop}
          value={`${filters.values.soldWithin} Year`}
          label="Sold Within"
          onClose={() => {
            setLocalFilters((prev) => ({ ...prev, soldWithin: filters.values.soldWithin }));
          }}
          renderContent={() => (
            <>
              <div className="bg-grey-30 p-4 rounded-t-xl border-b border-b-grey-100">
                <VoltDetailsSoldWithinFilters
                  value={localFilters.soldWithin}
                  onChange={(soldWithin) => setLocalFilters((prev) => ({ ...prev, soldWithin }))}
                />
              </div>
              <div className="px-4 py-3">
                <PopoverClose className="w-full">
                  <Button
                    className="w-full"
                    onClick={() => {
                      filters.setValue("soldWithin", localFilters.soldWithin, { shouldDirty: true, shouldValidate: true });
                    }}
                  >
                    Done
                  </Button>
                </PopoverClose>
              </div>
            </>
          )}
        />
        <VoltDetailsFiltersDropDown
          buttonClassName="shadow-6 border-0"
          onToggle={setBackDrop}
          value={getAcreageLabel(filters.values.acreageMin || null, filters.values.acreageMax || null)}
          label="Acreage"
          onClose={() => {
            setLocalFilters((prev) => ({ ...prev, acreageMin: filters.values.acreageMin, acreageMax: filters.values.acreageMax }));
          }}
          renderContent={() => (
            <>
              <div className="bg-grey-30 p-4 rounded-t-xl border-b border-b-grey-100">
                <VoltDetailsAcreageFilters
                  min={localFilters.acreageMin || null}
                  max={localFilters.acreageMax || null}
                  onChange={(key, value) => {
                    if (key === "min") {
                      setLocalFilters((prev) => ({
                        ...prev,
                        acreageMin: value,
                      }));
                    }
                    if (key === "max") {
                      setLocalFilters((prev) => ({
                        ...prev,
                        acreageMax: value,
                      }));
                    }
                  }}
                />
              </div>
              <div className="px-4 py-3">
                <PopoverClose className="w-full">
                  <Button
                    className="w-full"
                    onClick={() => {
                      filters.setValue("acreageMin", localFilters.acreageMin, { shouldDirty: true, shouldValidate: true });
                      filters.setValue("acreageMax", localFilters.acreageMax, { shouldDirty: true, shouldValidate: true });
                    }}
                  >
                    Done
                  </Button>
                </PopoverClose>
              </div>
            </>
          )}
        />
        <VoltDetailsFiltersDropDown
          buttonClassName="shadow-6 border-0"
          onToggle={setBackDrop}
          value={`Selected (${filters.values.propertyTypes?.length || propertyTypes.filter((el) => el.group === "vacant-land").length})`}
          label="Property Type"
          onClose={() => {
            setLocalFilters((prev) => ({ ...prev, propertyTypes: filters.values.propertyTypes }));
          }}
          renderContent={(close) => (
            <>
              {" "}
              <div className="bg-white p-4 rounded-t-xl border-b border-b-grey-100">
                <VoltDetailsPropertyTypeFilters
                  propertyTypes={propertyTypes}
                  onChange={(propertyTypes) => {
                    setLocalFilters((prev) => ({ ...prev, propertyTypes }));
                  }}
                  selected={localFilters.propertyTypes}
                />
              </div>
              <div className="px-4 py-3 flex justify-end gap-4">
                <PopoverClose className="w-full max-w-[150px]">
                  <Button
                    className="w-full max-w-[150px]"
                    variant="secondary"
                    onClick={() => {
                      setLocalFilters((prev) => ({ ...prev, propertyTypes: filters.values.propertyTypes }));
                    }}
                  >
                    Clear
                  </Button>
                </PopoverClose>
                <PopoverClose className="w-full max-w-[150px]">
                  <Button
                    className="w-full max-w-[150px]"
                    onClick={() => {
                      filters.setValue("propertyTypes", localFilters.propertyTypes, { shouldDirty: true, shouldValidate: true });
                    }}
                  >
                    Done
                  </Button>
                </PopoverClose>
              </div>
            </>
          )}
        />

        <Button
          style={{ animation: animateButton ? "shake 0.6s cubic-bezier(.36,.07,.19,.97) both" : "" }}
          disabled={!filters.isDirty}
          className="size-12 shadow-6 disabled:bg-primary-main-600"
          onClick={onSubmit}
        >
          <LuSearch className="text-white size-5" />
        </Button>
      </div>
    </>
  );
};

export default VoltDetailsDesktopFilters;
