"use client";

import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/dialogs/drawer";
import { Dialog, DialogContent } from "@/components/ui/dialogs/dialog";
import { cn } from "@/lib/utils";
import { LuSearch } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { z } from "zod";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { MdArrowForwardIos } from "react-icons/md";
import { Checkbox } from "@/components/ui/checkbox";
import { IoFilterOutline } from "react-icons/io5";
import { UseFormReset, UseFormSetValue } from "react-hook-form";
import VoltDetailsRadiusFilters from "./radius";
import VoltDetailsSoldWithinFilters from "./sold-within";
import VoltDetailsAcreageFilters from "./acreage";
import VoltDetailsPropertyTypeFilters from "./property-type";

interface VoltMobileFiltersProps {
  filters: {
    values: z.infer<typeof voltDetailsFiltersValidations>;
    setValue: UseFormSetValue<z.infer<typeof voltDetailsFiltersValidations>>;
    reset: UseFormReset<z.infer<typeof voltDetailsFiltersValidations>>;
    isDirty: boolean;
  };
  onSubmit: () => void;
  propertyTypes: Array<{ id: number; group: "vacant-land" | "other"; value: string }>;
  mapLayers: {
    label: string;
    value: string;
  }[];
  setSelectedLayer: Dispatch<SetStateAction<string>>;
  selectedLayer: string;
  isDataEmpty: boolean;
}

const VoltMobileFilters: FC<VoltMobileFiltersProps> = ({
  filters,
  onSubmit,
  propertyTypes,
  mapLayers,
  selectedLayer,
  setSelectedLayer,
  isDataEmpty,
}) => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState<"filters" | "property-types" | "basemap" | "layovers">("filters");
  const initialFilters = useRef(filters.values);
  const [localFilters, setLocalFilters] = useState(filters.values);
  const [localSelectedLayer, setLocalSelectedLayer] = useState(selectedLayer);
  const [showWarningModal, setShowWarningModal] = useState(false);

  useEffect(() => {
    if (isDataEmpty) {
      setShowWarningModal(true);
    }
  }, [isDataEmpty]);

  return (
    <>
      <Dialog open={showWarningModal}>
        <DialogContent
          className={cn("border-0 bg-white shadow-4 max-w-[90%] rounded-2xl")}
          closeModal={() => {
            setShowWarningModal(false);
          }}
        >
          <div className="flex flex-col gap-2 items-center">
            <div className="size-12 rounded-full bg-error-100 items-center justify-center flex mx-auto">
              <LuSearch
                onClick={() => {
                  setShowWarningModal(false);
                }}
                className="text-error size-6"
              />
            </div>
            <h1 className="text-center font-semibold pt-2">No result found</h1>
            <h2 className="text-center text-sm">You can extend filters and try again.</h2>
            <Button
              onClick={() => {
                setShowWarningModal(false);
                setOpen(true);
              }}
              className="w-full mt-3 max-w-[80%]"
            >
              Extend Filters
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Drawer onOpenChange={setOpen} open={open}>
        <DrawerTrigger asChild>
          <div className="border rounded-3xl py-1.5 px-4 shadow-5 bg-white flex items-center justify-center absolute z-10 right-2 bottom-12 text-sm font-medium gap-2">
            <IoFilterOutline className="size-5" />
            Filter
          </div>
        </DrawerTrigger>
        <DrawerContent
          onInteractOutside={(e) => {
            if (visible === "filters") {
              filters.reset(initialFilters.current);
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
                  value={filters.values.radius}
                  onChange={(radius) => {
                    filters.setValue("radius", radius, { shouldDirty: true, shouldValidate: true });
                  }}
                />
                <VoltDetailsSoldWithinFilters
                  rootClassName="space-y-4"
                  labelClassName="text-base"
                  itemClassName="py-3 px-5"
                  showLabel
                  value={filters.values.soldWithin}
                  onChange={(soldWithin) => {
                    filters.setValue("soldWithin", soldWithin, { shouldDirty: true, shouldValidate: true });
                  }}
                />
                <VoltDetailsAcreageFilters
                  rootClassName="max-w-full"
                  labelClassName="max-w-full text-base"
                  inputsWrapperClassName="max-w-full"
                  inputClassName="h-[44px]"
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
                <div className="flex flex-col gap-3">
                  <div
                    className={cn(
                      "border border-grey-100 bg-grey-30 min-h-[54px] px-3 py-2.5 flex justify-between items-center rounded-xl gap-4 cursor-pointer"
                    )}
                    onClick={() => setVisible("property-types")}
                  >
                    <div>
                      <p className="text-start leading-none text-primary-main font-medium text-xs">
                        {`Selected (${
                          filters.values.propertyTypes?.length || propertyTypes.filter((el) => el.group === "vacant-land").length
                        })`}
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
                      filters.reset(initialFilters.current);
                    }}
                    className="w-full"
                    variant="secondary"
                  >
                    Clear
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button
                    disabled={!filters.isDirty}
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
                    setLocalFilters({ ...localFilters, propertyTypes: filters.values.propertyTypes });
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
                    setLocalFilters({ ...localFilters, propertyTypes: filters.values.propertyTypes });
                    setVisible("filters");
                  }}
                  className="w-full"
                  variant="secondary"
                >
                  Back
                </Button>
                <Button
                  onClick={() => {
                    filters.reset({ ...filters.values, propertyTypes: localFilters.propertyTypes });
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
    </>
  );
};

export default VoltMobileFilters;
