"use client";

import { DialogTitle } from "@/components/ui/dialogs/dialog";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTrigger } from "@/components/ui/dialogs/drawer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn, updateSearchParamsWithFilters } from "@/lib/utils";
import { forwardRef, useRef, useState } from "react";
import { HiArrowsUpDown } from "react-icons/hi2";
import { ResponseModel } from "@/types/common";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useMediaQuery from "@/hooks/useMediaQuery";
import { z } from "zod";
import { userRecentSearchesValidations } from "@/zod-validations/filters-validations";
import { RiDeleteBin6Line } from "react-icons/ri";
import ResponsiveAlertDialog from "@/components/ui/dialogs/responsive-alert-dialog";
import useNotification from "@/hooks/useNotification";
import { breakPoints } from "../../../../../tailwind.config";
import Button from "../../shared/forms/Button";

const selectText = (selecting: boolean, isAllSelected: boolean, totalSelectedIds: number) => {
  if (selecting) {
    if (isAllSelected) {
      return "All Selected";
    }

    return `${selecting && totalSelectedIds > 0 ? totalSelectedIds : ""} Select`;
  }
  return "Select";
};

interface UserSelectListItemProps {
  selecting: boolean;
  isAllSelected: boolean;
  totalSelectedIds: number;
  onSelectClick: (selecting: boolean) => void;
  totalItems: number;
  onRemove: () => Promise<ResponseModel<any>>;
  onRemoveSuccess: () => void;
  dialogTitle: string;
  dialogDescription: string;
  sortEnum: Record<any, any>;
  sortChange: (value?: string | null) => void;
}

const UserSelectListItems = ({
  selecting,
  isAllSelected,
  totalSelectedIds,
  onSelectClick,
  totalItems,
  onRemove,
  onRemoveSuccess,
  dialogDescription,
  dialogTitle,
  sortEnum,
  sortChange,
}: UserSelectListItemProps) => {
  const { notify } = useNotification();
  const [openWarningModal, setWarningModal] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <>
      <ResponsiveAlertDialog
        variant="error"
        title={dialogTitle}
        description={dialogDescription}
        cancelButton={{
          label: "Cancel",
          onClick: () => setWarningModal(false),
          show: true,
        }}
        okButton={{
          label: "Delete",
          onClick: async () => {
            setPending(true);
            const { errorMessage } = await onRemove();
            setPending(false);

            if (!errorMessage) {
              onRemoveSuccess();
              setWarningModal(false);
            } else {
              notify({ title: "Error", description: errorMessage }, { variant: "error" });
            }
          },
          pending,
          show: true,
        }}
        closeModal={() => setWarningModal(false)}
        open={openWarningModal}
      />
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <Button
            className={cn(
              "bg-grey-50 hover:bg-gray-200 !text-black font-medium text-xs py-1 px-3 h-fit rounded-2xl",
              selecting && "!bg-grey-400"
            )}
            onClick={() => onSelectClick(selecting)}
          >
            {selectText(selecting, isAllSelected, totalSelectedIds)}
          </Button>
          {selecting && totalSelectedIds > 0 && (
            <div
              onClick={() => setWarningModal(true)}
              className="size-8 flex items-center justify-center rounded-full hover:bg-error-100 hover:text-error cursor-pointer"
            >
              <RiDeleteBin6Line />
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {!!totalItems && <p className="text-xs font-medium text-grey-600">{totalItems} Lands</p>}
          <Sort sortEnum={sortEnum} sortChange={sortChange} />
        </div>
      </div>
    </>
  );
};

export default UserSelectListItems;

const SortButton = forwardRef(({ selectedFilter, disabled }: { selectedFilter: string | null; disabled?: boolean }, ref: any) => (
  <div ref={ref} className={cn("flex items-center gap-2 cursor-pointer", disabled && "pointer-events-none opacity-55 !cursor-not-allowed")}>
    <p className="font-medium text-xs capitalize">{selectedFilter || "Sort by"}</p>
    <HiArrowsUpDown className="size-3" />
  </div>
));

const Sort = ({ sortEnum, sortChange }: { sortEnum: Record<any, any>; sortChange: (value?: string | null) => void }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { targetReached: isSmallDevice } = useMediaQuery(parseFloat(breakPoints.sm));
  const radioGroupRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

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
              {Object.values(sortEnum).map((sort) => (
                <RadioGroupItem key={sort} value={sort} label={sort} />
              ))}
            </RadioGroup>
            <DrawerFooter className="border-t">
              <Button
                onClick={() => {
                  const newValue = radioGroupRef.current?.querySelector("button[aria-checked='true']")?.getAttribute("value");
                  sortChange(newValue);
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
            {Object.values(sortEnum).map((sort) => (
              <div
                key={sort}
                className={cn(
                  "py-2.5 px-4 cursor-pointer hover:bg-primary-main-50 transition-all duration-100 font-medium text-xs capitalize",
                  searchParams.get("sortBy") === sort && "!bg-primary-main-100"
                )}
                onClick={() => {
                  sortChange(sort);
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
