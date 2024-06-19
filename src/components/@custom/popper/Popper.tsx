import { Popover, PopoverButton, PopoverPanel, Transition, PopoverProps } from "@headlessui/react";
import { ReactElement } from "react";

interface PopperProps {
  renderButton: ReactElement;
  children: ReactElement;
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
}

const Popper = ({ renderButton, children, anchorPlacement = "bottom", anchorGap = 8 }: PopperProps) => (
  <Popover>
    <PopoverButton>{renderButton}</PopoverButton>
    <Transition
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 translate-y-1"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-1"
    >
      <PopoverPanel anchor={{ to: anchorPlacement, gap: anchorGap }}>{children}</PopoverPanel>
    </Transition>
  </Popover>
);

export default Popper;
