"use client";

import useMediaQuery from "@/hooks/useMediaQuery";
import { forwardRef, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn, updateSearchParamsWithFilters } from "@/lib/utils";
import { HiArrowsUpDown } from "react-icons/hi2";
import { SortEnum } from "@/types/common";
import { z } from "zod";
import { userRecentSearchesValidations } from "@/zod-validations/filters-validations";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTrigger } from "@/components/ui/dialogs/drawer";
import { DialogTitle } from "@/components/ui/dialogs/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { breakPoints } from "../../../../../../tailwind.config";

const SortButton = forwardRef(({ selectedFilter, disabled }: { selectedFilter: string | null; disabled?: boolean }, ref: any) => (
  <div ref={ref} className={cn("flex items-center gap-2 cursor-pointer", disabled && "pointer-events-none opacity-55 !cursor-not-allowed")}>
    <p className="font-medium text-xs capitalize">{selectedFilter || "Sort by"}</p>
    <HiArrowsUpDown className="size-3" />
  </div>
));

const UserRecentSearchesSort = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { targetReached: isSmallDevice } = useMediaQuery(parseFloat(breakPoints.sm));
  const radioGroupRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const changeFilter = (value: SortEnum) => {
    const newSearchParams = updateSearchParamsWithFilters<z.infer<typeof userRecentSearchesValidations>>(
      [{ key: "sortBy", value }],
      searchParams.toString()
    );
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <>
      {isSmallDevice && (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger>
            <SortButton selectedFilter={searchParams.get("sortBy")} />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DialogTitle className="border-b pb-4">Sort By</DialogTitle>
            </DrawerHeader>
            <RadioGroup
              ref={radioGroupRef}
              onValueChange={(value) => {}}
              defaultValue={searchParams.get("sortBy") || ""}
              className="capitalize px-4 py-6"
            >
              {Object.values(SortEnum).map((sort) => (
                <RadioGroupItem key={sort} value={sort} label={sort} />
              ))}
            </RadioGroup>
            <DrawerFooter className="border-t">
              <Button
                onClick={() => {
                  const newValue = radioGroupRef.current?.querySelector("button[aria-checked='true']")?.getAttribute("value");
                  changeFilter(newValue as SortEnum);
                  setOpen(false);
                }}
              >
                Apply
              </Button>
              <Button variant="secondary">Reset</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
      {!isSmallDevice && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger>
            <SortButton selectedFilter={searchParams.get("sortBy")} />
          </PopoverTrigger>
          <PopoverContent className="min-w-36 bg-white p-0 border-0 shadow-4 rounded-2xl !w-full !max-w-max">
            {Object.values(SortEnum).map((sort) => (
              <div
                key={sort}
                className={cn(
                  "py-2.5 px-4 cursor-pointer hover:bg-primary-main-50 transition-all duration-100 font-medium text-xs capitalize",
                  searchParams.get("sortBy") === sort && "!bg-primary-main-100"
                )}
                onClick={() => {
                  changeFilter(sort);
                  setOpen(false);
                }}
              >
                {sort}
              </div>
            ))}
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};

export default UserRecentSearchesSort;
