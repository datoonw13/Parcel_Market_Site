"use client";

import { Button } from "@/components/ui/button";
import { z } from "zod";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { AnimatePresence, motion } from "framer-motion";
import { PopoverClose } from "@radix-ui/react-popover";
import VoltDetailsFiltersDropDown from "./dropdown";
import VoltDetailsRadiusFilters from "./radius";
import VoltDetailsSoldWithinFilters from "./sold-within";
import VoltDetailsAcreageFilters from "./acreage";
import VoltDetailsPropertyTypeFilters from "./property-type";

type IFilters = z.infer<typeof voltDetailsFiltersValidations>;

interface IVoltDetailsDesktopFilters {
  filters: IFilters;
  setFilters: Dispatch<SetStateAction<IFilters>>;
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

const VoltDetailsDesktopFilters: FC<IVoltDetailsDesktopFilters> = ({ filters, setFilters, onSubmit, propertyTypes }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [backDrop, setBackDrop] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

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
          value={`${filters.radius} Mile`}
          label="Radius"
          onClose={() => {
            setLocalFilters((prev) => ({ ...prev, radius: filters.radius }));
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
                      setFilters((prev) => ({ ...prev, radius: localFilters.radius }));
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
          value={`${filters.soldWithin} Year`}
          label="Sold Within"
          onClose={() => {
            setLocalFilters((prev) => ({ ...prev, soldWithin: filters.soldWithin }));
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
                      setFilters((prev) => ({ ...prev, soldWithin: localFilters.soldWithin }));
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
          value={getAcreageLabel(filters.acreageMin || null, filters.acreageMax || null)}
          label="Acreage"
          onClose={() => {
            setLocalFilters((prev) => ({ ...prev, acreageMin: filters.acreageMin, acreageMax: filters.acreageMax }));
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
                      setFilters((prev) => ({ ...prev, acreageMin: localFilters.acreageMin, acreageMax: localFilters.acreageMax }));
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
          value={`Selected (${filters.propertyTypes?.length || propertyTypes.filter((el) => el.group === "vacant-land").length})`}
          label="Property Type"
          onClose={() => {
            setLocalFilters((prev) => ({ ...prev, propertyTypes: filters.propertyTypes }));
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
                      setLocalFilters((prev) => ({ ...prev, propertyTypes: filters.propertyTypes }));
                    }}
                  >
                    Clear
                  </Button>
                </PopoverClose>
                <PopoverClose className="w-full max-w-[150px]">
                  <Button
                    className="w-full max-w-[150px]"
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, propertyTypes: localFilters.propertyTypes }));
                    }}
                  >
                    Done
                  </Button>
                </PopoverClose>
              </div>
            </>
          )}
        />
        <Button className="size-12 shadow-6" onClick={onSubmit}>
          <LuSearch className="text-white size-5" />
        </Button>
      </div>
    </>
  );
};

export default VoltDetailsDesktopFilters;
