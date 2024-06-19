import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import clsx from "clsx";
import { ReactElement } from "react";

interface PopperProps {
  renderButton: ReactElement;
  children: ReactElement | ReactElement[];
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
  contentClassName?: string
}

const Popper = ({ renderButton, children, anchorPlacement = "bottom", anchorGap = 8, contentClassName }: PopperProps) => (
  <Popover>
    <PopoverButton className="outline-0">{renderButton}</PopoverButton>
    <Transition
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 translate-y-1"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-1"
    >
      <PopoverPanel anchor={{ to: anchorPlacement, gap: anchorGap }} className={clsx(contentClassName)}>
        {children}
      </PopoverPanel>
    </Transition>
  </Popover>
);

export default Popper;
