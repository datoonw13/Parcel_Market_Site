"use client";

import { Dispatch, FC, SetStateAction, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/dialogs/drawer";
import { CiFilter } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { z } from "zod";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { cn } from "@/lib/utils";
import { MdArrowForwardIos } from "react-icons/md";
import { Checkbox } from "@/components/ui/checkbox";
import VoltDetailsRadiusFilters from "../filters/radius";
import VoltDetailsSoldWithinFilters from "../filters/sold-within";
import VoltDetailsAcreageFilters from "../filters/acreage";
import VoltDetailsPropertyTypeFilters from "../filters/property-type";

type IFilters = z.infer<typeof voltDetailsFiltersValidations>;

interface VoltMobileFiltersProps {
  filters: IFilters;
  setFilters: Dispatch<SetStateAction<IFilters>>;
  onSubmit: () => void;
  onFilterToggle?: (value: boolean) => void;
  propertyTypes: Array<{ id: number; group: "vacant-land" | "other"; value: string }>;
  mapLayers: {
    label: string;
    value: string;
  }[];
  setSelectedLayer: Dispatch<SetStateAction<string>>;
  selectedLayer: string;
}

const VoltMobileFilters: FC<VoltMobileFiltersProps> = ({
  filters,
  setFilters,
  onSubmit,
  onFilterToggle,
  propertyTypes,
  mapLayers,
  selectedLayer,
  setSelectedLayer,
}) => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState<"filters" | "property-types" | "basemap" | "layovers">("filters");
  const initialFilters = useRef(filters);
  const [localFilters, setLocalFilters] = useState(filters);
  const [localSelectedLayer, setLocalSelectedLayer] = useState(selectedLayer);

  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger asChild>
        <div className="border rounded-xl size-9 bg-white flex items-center justify-center">
          <CiFilter className="size-6" />
        </div>
      </DrawerTrigger>
      <DrawerContent
        onInteractOutside={(e) => {
          if (visible === "filters") {
            setFilters(initialFilters.current);
            setLocalFilters(initialFilters.current);
            setLocalSelectedLayer(selectedLayer);
          } else {
            e.stopPropagation();
            e.preventDefault();
            setVisible("filters");
            setLocalSelectedLayer(selectedLayer);
          }
        }}
        className="max-h-[92%] h-full flex"
      >
        {visible === "filters" && (
          <div className="mx-auto w-full max-w-sm h-full flex flex-col justify-between">
            <DrawerHeader className="flex justify-between items-center gap-4">
              <DrawerTitle className="text-2xl font font-semibold">Filter</DrawerTitle>
              <IoMdClose className="size-6 text-grey-600" onClick={() => setOpen(false)} />
            </DrawerHeader>
            <div className="px-4 space-y-8 overflow-auto pb-12">
              <VoltDetailsRadiusFilters
                rootClassName="space-y-4"
                itemClassName="py-3 px-5"
                labelClassName="text-base"
                value={filters.radius}
                onChange={(radius) => setFilters((prev) => ({ ...prev, radius }))}
              />
              <VoltDetailsSoldWithinFilters
                rootClassName="space-y-4"
                labelClassName="text-base"
                itemClassName="py-3 px-5"
                showLabel
                value={filters.soldWithin}
                onChange={(soldWithin) => setFilters((prev) => ({ ...prev, soldWithin }))}
              />
              <VoltDetailsAcreageFilters
                rootClassName="max-w-full"
                labelClassName="max-w-full text-base"
                inputsWrapperClassName="max-w-full"
                inputClassName="h-[44px]"
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
              <div className="flex flex-col gap-3">
                <div
                  className={cn(
                    "border border-grey-100 bg-grey-30 min-h-[54px] px-3 py-2.5 flex justify-between items-center rounded-xl gap-4 cursor-pointer"
                  )}
                  onClick={() => setVisible("property-types")}
                >
                  <div>
                    <p className="text-start leading-none text-primary-main font-medium text-xs">
                      {`Selected (${filters.propertyTypes?.length || propertyTypes.filter((el) => el.group === "vacant-land").length})`}
                    </p>
                    <p className="text-start leading-none text-black font-medium text-sm pt-1">Property Type</p>
                  </div>
                  <MdArrowForwardIos className={cn("text-[#1E1E1E] transition-all rotate-360")} />
                </div>
                <div
                  className={cn(
                    "border border-grey-100 bg-grey-30 min-h-[54px] px-3 py-2.5 flex justify-between items-center rounded-xl gap-4 cursor-pointer"
                  )}
                  onClick={() => setVisible("basemap")}
                >
                  <div>
                    <p className="text-start leading-none text-primary-main font-medium text-xs">
                      {mapLayers?.find((el) => el.value === localSelectedLayer)?.label}
                    </p>
                    <p className="text-start leading-none text-black font-medium text-sm pt-1">Basemap</p>
                  </div>
                  <MdArrowForwardIos className={cn("text-[#1E1E1E] transition-all rotate-360")} />
                </div>
                <div
                  className={cn(
                    "pointer-events-none opacity-75 border border-grey-100 bg-grey-30 min-h-[54px] px-3 py-2.5 flex justify-between items-center rounded-xl gap-4 cursor-pointer"
                  )}
                  onClick={() => setVisible("layovers")}
                >
                  <div>
                    <p className="text-start leading-none text-black font-medium text-sm pt-1">Layovers</p>
                  </div>
                  <MdArrowForwardIos className={cn("text-[#1E1E1E] transition-all rotate-360")} />
                </div>
              </div>
            </div>
            <DrawerFooter className="flex flex-row w-full gap-3 border-t  bg-white mt-0 sticky bottom-0">
              <DrawerClose asChild>
                <Button
                  onClick={() => {
                    setFilters(initialFilters.current);
                  }}
                  className="w-full"
                  variant="secondary"
                >
                  Clear
                </Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button
                  onClick={() => {
                    onSubmit();
                    setSelectedLayer(localSelectedLayer);
                  }}
                  className="w-full"
                >
                  Done
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        )}

        {visible === "property-types" && (
          <div className="mx-auto w-full max-w-sm h-full flex flex-col">
            <DrawerHeader className="flex justify-between items-center gap-4">
              <DrawerTitle className="text-2xl font font-semibold">Property Type</DrawerTitle>
              <IoMdClose
                className="size-6 text-grey-600"
                onClick={() => {
                  setLocalFilters({ ...localFilters, propertyTypes: filters.propertyTypes });
                  setVisible("filters");
                }}
              />
            </DrawerHeader>
            <div className="px-4 space-y-8 overflow-auto pb-12 h-full grid">
              <VoltDetailsPropertyTypeFilters
                className="flex-col gap-4 h-auto"
                propertyTypes={propertyTypes}
                onChange={(propertyTypes) => {
                  setLocalFilters((prev) => ({ ...prev, propertyTypes }));
                }}
                selected={localFilters.propertyTypes}
              />
            </div>
            <DrawerFooter className="flex flex-row w-full gap-3 border-t  bg-white mt-0 sticky bottom-0">
              <Button
                onClick={() => {
                  setLocalFilters({ ...localFilters, propertyTypes: filters.propertyTypes });
                  setVisible("filters");
                }}
                className="w-full"
                variant="secondary"
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  setFilters({ ...filters, propertyTypes: localFilters.propertyTypes });
                  setVisible("filters");
                }}
                className="w-full"
              >
                Done
              </Button>
            </DrawerFooter>
          </div>
        )}
        {visible === "basemap" && (
          <div className="mx-auto w-full max-w-sm h-full flex flex-col">
            <DrawerHeader className="flex justify-between items-center gap-4">
              <DrawerTitle className="text-2xl font font-semibold">BaseMap</DrawerTitle>
              <IoMdClose
                className="size-6 text-grey-600"
                onClick={() => {
                  setVisible("filters");
                  setLocalSelectedLayer(selectedLayer);
                }}
              />
            </DrawerHeader>
            <div className="px-4 space-y-4 overflow-auto pb-12 h-full">
              {mapLayers.map((el) => (
                <Checkbox
                  className="items-start [&>button]:mt-1"
                  onCheckedChange={() => {
                    setLocalSelectedLayer(el.value);
                  }}
                  checked={localSelectedLayer === el.value}
                  label={<span className="font-medium text-xs">{el.label}</span>}
                  key={el.value}
                  id={el.value}
                />
              ))}
            </div>
            <DrawerFooter className="flex flex-row w-full gap-3 border-t  bg-white mt-0 sticky bottom-0">
              <Button
                onClick={() => {
                  setVisible("filters");
                  setLocalSelectedLayer(selectedLayer);
                }}
                className="w-full"
                variant="secondary"
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  setVisible("filters");
                }}
                className="w-full"
              >
                Done
              </Button>
            </DrawerFooter>
          </div>
        )}
        {visible === "layovers" && (
          <div className="mx-auto w-full max-w-sm h-full flex flex-col justify-between">
            <DrawerHeader className="flex justify-between items-center gap-4">
              <DrawerTitle className="text-2xl font font-semibold">Layovers</DrawerTitle>
              <IoMdClose className="size-6 text-grey-600" onClick={() => setVisible("filters")} />
            </DrawerHeader>
            <div className="px-4 space-y-8 overflow-auto pb-12">Layovers</div>
            <DrawerFooter className="flex flex-row w-full gap-3 border-t  bg-white mt-0 sticky bottom-0">
              <DrawerClose asChild>
                <Button onClick={() => {}} className="w-full" variant="secondary">
                  Back
                </Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button onClick={() => {}} className="w-full">
                  Done
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default VoltMobileFilters;
