"use client";

import { DialogOverlay } from "@/components/ui/dialogs/dialog";
import { DrawerOverlay } from "@/components/ui/dialogs/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";

const VoltDetailsFiltersDropDown = ({
  renderContent,
  renderContentAdditionalContent,
  value,
  label,
  onClose,
  icon,
  side,
  className,
  buttonClassName,
  onOpen,
}: {
  renderContent: (close: () => void) => ReactNode;
  renderContentAdditionalContent?: (close: () => void) => ReactNode;
  value: string;
  label: string;
  onClose?: () => void;
  onOpen?: () => void;
  icon?: ReactNode;
  side?: any;
  className?: string;
  buttonClassName?: string;
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
          if (onOpen && value) {
            onOpen();
          }
        }}
      >
        <PopoverTrigger className={cn("w-full", className)}>
          <div
            className={cn("border border-grey-100 bg-white px-3 py-2 flex justify-between items-center rounded-xl gap-4", buttonClassName)}
          >
            <div>
              <p className="text-start leading-none text-primary-main font-medium text-xs">{value}</p>
              <p className="text-start leading-none text-black font-medium text-sm pt-1">{label}</p>
            </div>
            {icon || <MdArrowForwardIos className={cn("text-[#1E1E1E] transition-all", open ? "-rotate-90" : "rotate-90")} />}
          </div>
        </PopoverTrigger>
        <PopoverContent
          side={side}
          align="start"
          className="flex gap-2 "
          // className="min-w-36 bg-white p-0 shadow-4 rounded-xl !w-full !max-w-max border border-grey-100"
        >
          <div className="min-w-36 bg-white p-0 shadow-4 rounded-xl !w-full !max-w-max border border-grey-100">
            {renderContent(() => setOpen(false))}
          </div>
          {renderContentAdditionalContent && (
            <div className="min-w-36 bg-white p-0 shadow-4 rounded-xl !w-full !max-w-max border border-grey-100">
              {renderContentAdditionalContent(() => setOpen(false))}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
};

export default VoltDetailsFiltersDropDown;
