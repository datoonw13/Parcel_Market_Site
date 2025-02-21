"use client";

import { Dispatch, FC, SetStateAction, TransitionStartFunction, useCallback, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/dialogs/drawer";
import { CiFilter } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { z } from "zod";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useMediaQuery from "@/hooks/useMediaQuery";
import VoltDetailsRadiusFilters from "../filters/radius";
import VoltDetailsSoldWithinFilters from "../filters/sold-within";
import VoltDetailsAcreageFilters from "../filters/acreage";

type IFilters = z.infer<typeof voltDetailsFiltersValidations>;

interface VoltMobileFiltersProps {
  filters: IFilters;
  setFilters: Dispatch<SetStateAction<IFilters>>;
  onSubmit: () => void;
  onFilterToggle?: (value: boolean) => void;
  propertyTypes: Array<{ id: number; group: "vacant-land" | "other"; value: string }>;
}

const VoltMobileFilters: FC<VoltMobileFiltersProps> = ({ filters, setFilters, onSubmit, onFilterToggle, propertyTypes }) => {
  const [open, setOpen] = useState(false);
  const initialFilters = useRef(filters);

  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger asChild>
        <div className="border rounded-xl size-9 bg-white flex items-center justify-center">
          <CiFilter className="size-6" />
        </div>
      </DrawerTrigger>
      <DrawerContent
        onInteractOutside={() => {
          setFilters(initialFilters.current);
        }}
        className="max-h-[92%] h-full flex"
      >
        <div className="mx-auto w-full max-w-sm h-full flex flex-col">
          <DrawerHeader className="flex justify-between items-center gap-4">
            <DrawerTitle className="text-2xl font font-semibold">Filter</DrawerTitle>
            <IoMdClose className="size-6 text-grey-600" onClick={() => setOpen(false)} />
          </DrawerHeader>
          <div className="px-4 space-y-8">
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
          </div>
          <DrawerFooter className="flex flex-row w-full gap-3 border-t">
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
              <Button onClick={onSubmit} className="w-full">
                Done
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default VoltMobileFilters;
