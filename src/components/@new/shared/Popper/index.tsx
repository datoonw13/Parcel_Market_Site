"use client";

import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import clsx from "clsx";
import { ReactElement, forwardRef, useEffect, useRef, useState, ReactNode, useCallback, Dispatch, SetStateAction } from "react";

interface PopperProps {
  renderButton: (open: boolean, setOpen: Dispatch<SetStateAction<boolean>>) => ReactElement;
  renderContent: (closePopper: () => void) => ReactNode;
  anchorPlacement?:
    | "bottom end"
    | "bottom start"
    | "top end"
    | "top start"
    | "right end"
    | "right start"
    | "left end"
    | "left start"
    | "top"
    | "bottom";
  anchorGap?: number;
  contentClassName?: string;
  fixedWidth?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

const MyCustomButton = forwardRef((props: any, ref: any) => (
  <div className="..." ref={ref} onClick={props.onClick}>
    {props.children}
  </div>
));

const Popper = ({
  renderButton,
  renderContent,
  anchorPlacement = "bottom",
  anchorGap = 8,
  contentClassName,
  fixedWidth,
  onClose,
  onOpen,
}: PopperProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const closePopper = useCallback(() => {
    setOpen(false);
  }, []);

  const handleOutSideClick = useCallback(
    (event: any) => {
      if (open && !ref.current?.contains(event.target) && !buttonRef?.current?.contains(event.target)) {
        closePopper();
      }
    },
    [closePopper, open]
  );

  useEffect(() => {
    window.addEventListener("pointerdown", handleOutSideClick);
    return () => {
      window.removeEventListener("pointerdown", handleOutSideClick);
    };
  }, [handleOutSideClick]);

  return (
    <Popover>
      <PopoverButton ref={buttonRef} as={MyCustomButton} className="outline-0">
        {renderButton(open, setOpen)}
      </PopoverButton>
      <Transition
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
        show={open}
        afterLeave={onClose}
        beforeEnter={onOpen}
      >
        <PopoverPanel
          ref={ref}
          modal={false}
          portal={false}
          static
          anchor={{ to: anchorPlacement, gap: anchorGap }}
          className={clsx(contentClassName, "min-w-[var(--button-width)]", fixedWidth && "w-[var(--button-width)]")}
        >
          {renderContent(() => setOpen(false))}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
};

export default Popper;
