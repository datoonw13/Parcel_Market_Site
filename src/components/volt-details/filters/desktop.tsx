"use client";

import { Button } from "@/components/ui/button";
import { z } from "zod";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { LuSearch } from "react-icons/lu";
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
  onFilterToggle?: (value: boolean) => void;
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

const VoltDetailsDesktopFilters: FC<IVoltDetailsDesktopFilters> = ({ filters, setFilters, onSubmit, onFilterToggle }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  return (
    <div className="flex gap-2">
      <VoltDetailsFiltersDropDown
        onOpen={() => onFilterToggle && onFilterToggle(true)}
        value={`${filters.radius} Mile`}
        label="Radius"
        onClose={() => {
          onFilterToggle && onFilterToggle(false);
          setLocalFilters((prev) => ({ ...prev, radius: filters.radius }));
        }}
        renderContent={(close) => (
          <>
            <div className="bg-grey-30 p-4 rounded-t-xl border-b border-b-grey-100">
              <VoltDetailsRadiusFilters
                value={localFilters.radius}
                onChange={(radius) => setLocalFilters((prev) => ({ ...prev, radius }))}
              />
            </div>
            <div className="px-4 py-3">
              <Button
                className="w-full"
                onClick={() => {
                  close();
                  onFilterToggle && onFilterToggle(false);
                  setFilters((prev) => ({ ...prev, radius: localFilters.radius }));
                }}
              >
                Done
              </Button>
            </div>
          </>
        )}
      />
      <VoltDetailsFiltersDropDown
        onOpen={() => onFilterToggle && onFilterToggle(true)}
        value={`${filters.soldWithin} Year`}
        label="Sold Within"
        onClose={() => {
          onFilterToggle && onFilterToggle(false);
          setLocalFilters((prev) => ({ ...prev, radius: filters.radius }));
        }}
        renderContent={(close) => (
          <>
            {" "}
            <div className="bg-grey-30 p-4 rounded-t-xl border-b border-b-grey-100">
              <VoltDetailsSoldWithinFilters
                value={localFilters.soldWithin}
                onChange={(soldWithin) => setLocalFilters((prev) => ({ ...prev, soldWithin }))}
              />
            </div>
            <div className="px-4 py-3">
              <Button
                className="w-full"
                onClick={() => {
                  close();
                  onFilterToggle && onFilterToggle(false);
                  setFilters((prev) => ({ ...prev, soldWithin: localFilters.soldWithin }));
                }}
              >
                Done
              </Button>
            </div>
          </>
        )}
      />
      <VoltDetailsFiltersDropDown
        onOpen={() => onFilterToggle && onFilterToggle(true)}
        value={getAcreageLabel(filters.acreageMin || null, filters.acreageMax || null)}
        label="Acreage"
        onClose={() => {
          onFilterToggle && onFilterToggle(false);
          setLocalFilters((prev) => ({ ...prev, acreageMin: filters.acreageMin, acreageMax: filters.acreageMax }));
        }}
        renderContent={(close) => (
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
              <Button
                className="w-full"
                onClick={() => {
                  close();
                  onFilterToggle && onFilterToggle(false);
                  setFilters((prev) => ({ ...prev, acreageMin: localFilters.acreageMin, acreageMax: localFilters.acreageMax }));
                }}
              >
                Done
              </Button>
            </div>
          </>
        )}
      />
      <VoltDetailsFiltersDropDown
        onOpen={() => onFilterToggle && onFilterToggle(true)}
        value={`Selected (${filters.propertyTypes?.split(",")?.length || 0})`}
        label="Property Type"
        onClose={() => {
          setLocalFilters((prev) => ({ ...prev, propertyTypes: filters.propertyTypes }));
          onFilterToggle && onFilterToggle(false);
        }}
        renderContent={(close) => (
          <>
            {" "}
            <div className="bg-white p-4 rounded-t-xl border-b border-b-grey-100">
              <VoltDetailsPropertyTypeFilters
                onChange={(propertyTypes) => {
                  setLocalFilters((prev) => ({ ...prev, propertyTypes }));
                }}
                selected={localFilters.propertyTypes}
              />
            </div>
            <div className="px-4 py-3 flex justify-end gap-4">
              <Button
                className="w-full max-w-[150px]"
                variant="secondary"
                onClick={() => {
                  close();
                  onFilterToggle && onFilterToggle(false);
                  setLocalFilters((prev) => ({ ...prev, propertyTypes: filters.propertyTypes }));
                }}
              >
                Close
              </Button>
              <Button
                className="w-full max-w-[150px]"
                onClick={() => {
                  close();
                  onFilterToggle && onFilterToggle(false);
                  setFilters((prev) => ({ ...prev, propertyTypes: localFilters.propertyTypes }));
                }}
              >
                Done
              </Button>
            </div>
          </>
        )}
      />
      <Button className="size-12" onClick={onSubmit}>
        <LuSearch className="text-white size-5" />
      </Button>
    </div>
  );
};

export default VoltDetailsDesktopFilters;
