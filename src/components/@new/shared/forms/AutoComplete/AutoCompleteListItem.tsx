import clsx from "clsx";
import React, { ReactNode } from "react";

const AutoCompleteListItem = ({
  children,
  onClick,
  selected,
  id,
  className,
}: {
  children: ReactNode;
  onClick: () => void;
  selected?: boolean;
  id: string;
  className?: string;
}) => (
  <div
    id={id}
    onClick={onClick}
    className={clsx(
      "py-2.5 px-4 cursor-pointer hover:bg-primary-main-50 transition-all duration-100 font-medium text-xs",
      selected && "!bg-primary-main-100",
      className
    )}
  >
    {children}
  </div>
);

export default AutoCompleteListItem;
