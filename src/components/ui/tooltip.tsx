"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, ElementRef, FC, ReactElement, forwardRef, useState } from "react";

const TooltipContent = forwardRef<ElementRef<typeof TooltipPrimitive.Content>, ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>>(
  ({ className, sideOffset = 4, ...props }, ref) => (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-950 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50",
        className
      )}
      {...props}
    />
  )
);

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

interface TooltipProps {
  renderButton: ReactElement;
  renderContent: ReactElement | string;
  buttonClassName?: string;
  contentClasses?: string;
}

const Tooltip: FC<TooltipProps> = ({ renderButton, renderContent, buttonClassName, contentClasses }) => {
  const [open, setOpen] = useState(false);
  return (
    <TooltipPrimitive.Provider delayDuration={300}>
      <TooltipPrimitive.Root open={open} onOpenChange={setOpen}>
        <TooltipPrimitive.Trigger
          onClick={(e) => {
            setOpen(!open);
          }}
          asChild
          className={cn("cursor-pointer", buttonClassName)}
        >
          <div>{renderButton}</div>
        </TooltipPrimitive.Trigger>
        <TooltipContent
          className={cn("bg-black rounded-md py-1.5 px-3 !text-xss text-white max-w-60 text-center font-medium", contentClasses)}
        >
          {renderContent}
        </TooltipContent>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

export { Tooltip };
