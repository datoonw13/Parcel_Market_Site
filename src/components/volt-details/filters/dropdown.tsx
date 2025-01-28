"use client";

import { DialogOverlay } from "@/components/ui/dialogs/dialog";
import { DrawerOverlay } from "@/components/ui/dialogs/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";

const VoltDetailsFiltersDropDown = ({
  renderContent,
  value,
  label,
  onClose,
}: {
  renderContent: (close: () => void) => ReactNode;
  value: string;
  label: string;
  onClose?: () => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Popover
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value && onClose) {
            onClose();
          }
        }}
      >
        <PopoverTrigger className="w-full">
          <div className="border border-grey-100 bg-white px-3 py-2 flex justify-between items-center rounded-xl gap-4">
            <div>
              <p className="text-start leading-none text-primary-main font-medium text-xs">{value}</p>
              <p className="text-start leading-none text-black font-medium text-sm pt-1">{label}</p>
            </div>
            <MdArrowForwardIos className={cn("text-[#1E1E1E] transition-all", open ? "-rotate-90" : "rotate-90")} />
          </div>
        </PopoverTrigger>
        <PopoverContent align="start" className="min-w-36 bg-white p-0 shadow-4 rounded-xl !w-full !max-w-max border border-grey-100">
          {renderContent(() => setOpen(false))}
        </PopoverContent>
      </Popover>
    </>
  );
};

export default VoltDetailsFiltersDropDown;
