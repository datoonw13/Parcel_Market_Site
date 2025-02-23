"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

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
  onToggle,
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
  onToggle?: (open: boolean) => void;
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
          onToggle && onToggle(value);
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
        <PopoverContent forceMount side={side} align="start" className="flex gap-2 !outline-none">
          <AnimatePresence>
            <motion.div
              onAnimationStart={() => {
                const el = document.querySelector<HTMLElement>("[data-radix-popper-content-wrapper]");
                if (el) {
                  el.style.setProperty("--radix-popper-zIndex", "30");
                }
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.1 }}
            >
              <div className="min-w-[--radix-popper-anchor-width] bg-white p-0 shadow-4 rounded-xl !w-full !max-w-max border border-grey-100">
                {renderContent(() => setOpen(false))}
              </div>
              {renderContentAdditionalContent && (
                <div className="min-w-36 bg-white p-0 shadow-4 rounded-xl !w-full !max-w-max border border-grey-100">
                  {renderContentAdditionalContent(() => setOpen(false))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default VoltDetailsFiltersDropDown;
