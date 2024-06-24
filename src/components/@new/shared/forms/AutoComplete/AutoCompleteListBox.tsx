"use client";

import clsx from "clsx";
import React, { ReactNode } from "react";
import SimpleBar from "simplebar-react";

const AutoCompleteListBox = ({ children, className }: { children: ReactNode; className?: string }) => (
  <SimpleBar className={clsx("max-h-64 shadow-1 rounded-xl bg-white", className)}>
    <div className="rounded-xl ">{children}</div>
  </SimpleBar>
);

export default AutoCompleteListBox;
