"use client";

import { Button } from "@/components/ui/button";
import { z } from "zod";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { IoFilter } from "react-icons/io5";
import { MdArrowForwardIos } from "react-icons/md";
import { cn } from "@/lib/utils";
import VoltDetailsFiltersDropDown from "./dropdown";
import VoltDetailsRadiusFilters from "./radius";
import VoltDetailsSoldWithinFilters from "./sold-within";
import VoltDetailsAcreageFilters from "./acreage";
import VoltDetailsPropertyTypeFilters from "./property-type";

type IFilters = z.infer<typeof voltDetailsFiltersValidations>;

interface IVoltDetailsMobileFilters {
  filters: IFilters;
  setFilters: Dispatch<SetStateAction<IFilters>>;
  onSubmit: () => void;
  resetFilters: () => void;
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

const VoltDetailsMobileFilters: FC<IVoltDetailsMobileFilters> = ({ filters, setFilters, onSubmit, resetFilters }) => {
  // const [localFilters, setLocalFilters] = useState(filters);
  const [showPropertyFilters, setPropertyFilter] = useState(false);

  return (
    <VoltDetailsFiltersDropDown
      value={`${0} Selected`}
      label="Filter"
      onClose={() => {
        resetFilters();
        setPropertyFilter(false);
      }}
      icon={<IoFilter />}
      renderContent={(close) => (
        <div className="flex flex-col justify-between h-full">
          <div className="bg-white py-5 space-y-5 rounded-t-2xl">
            <div className="px-5">
              <VoltDetailsRadiusFilters value={filters.radius} onChange={(radius) => setFilters((prev) => ({ ...prev, radius }))} />
            </div>
            <div className="px-5">
              <VoltDetailsSoldWithinFilters
                showLabel
                value={filters.soldWithin}
                onChange={(soldWithin) => setFilters((prev) => ({ ...prev, soldWithin }))}
              />
            </div>
            <div className="px-5">
              <VoltDetailsAcreageFilters
                min={filters.acreageMin || null}
                max={filters.acreageMax || null}
                onChange={(key, value) => {
                  if (key === "min") {
                    setFilters((prev) => ({
                      ...prev,
                      acreageMin: value,
                    }));
                  }
                  if (key === "max") {
                    setFilters((prev) => ({
                      ...prev,
                      acreageMax: value,
                    }));
                  }
                }}
              />
            </div>
            <div className="px-5">
              <div
                onClick={() => setPropertyFilter(!showPropertyFilters)}
                className="border border-grey-100 bg-white px-3 py-2 flex justify-between items-center rounded-xl gap-4 cursor-pointer"
              >
                <div>
                  <p className="text-start leading-none text-primary-main font-medium text-xs">
                    Selected ({filters.propertyTypes?.split(",").length || 0})
                  </p>
                  <p className="text-start leading-none text-black font-medium text-sm pt-1">Property Type</p>
                </div>
                <MdArrowForwardIos className={cn("text-[#1E1E1E] transition-all")} />
              </div>
            </div>
          </div>
          <div className="p-4 grid grid-cols-[1fr_1.5fr] gap-4">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                close();
                resetFilters();
              }}
            >
              Clear
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                close();
                onSubmit();
              }}
            >
              Done
            </Button>
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
                    onChange={(propertyTypes) => {
                      setFilters((prev) => ({ ...prev, propertyTypes }));
                    }}
                    selected={filters.propertyTypes}
                  />
                </div>
                <div className="px-4 py-3 flex justify-end gap-4">
                  <Button
                    className="w-full max-w-[150px]"
                    variant="secondary"
                    onClick={() => {
                      setPropertyFilter(false);
                      setFilters((prev) => ({ ...prev, propertyTypes: filters.propertyTypes }));
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    className="w-full max-w-[150px]"
                    onClick={() => {
                      setPropertyFilter(false);
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
  );
};

export default VoltDetailsMobileFilters;
