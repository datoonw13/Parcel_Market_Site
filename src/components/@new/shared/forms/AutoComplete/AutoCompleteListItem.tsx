import React, { ReactNode } from "react";

const AutoCompleteListItem = ({ children, onClick }: { children: ReactNode; onClick: () => void }) => (
  <div onClick={onClick} className="py-2 px-4 cursor-pointer hover:bg-primary-main-50 transition-all duration-100">
    {children}
  </div>
);

export default AutoCompleteListItem;
