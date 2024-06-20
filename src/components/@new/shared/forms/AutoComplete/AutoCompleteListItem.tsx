import clsx from "clsx";
import React, { ReactNode } from "react";

const AutoCompleteListItem = ({ children, onClick, selected }: { children: ReactNode; onClick: () => void; selected?: boolean }) => (
  <div
    onClick={onClick}
    className={clsx(
      "py-2.5 px-4 cursor-pointer hover:bg-primary-main-50 transition-all duration-100 font-medium text-xs",
      selected && "!bg-primary-main-100"
    )}
  >
    {children}
  </div>
);

export default AutoCompleteListItem;
