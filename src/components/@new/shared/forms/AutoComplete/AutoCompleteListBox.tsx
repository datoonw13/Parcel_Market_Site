"use client";

import React, { ReactNode } from "react";
import SimpleBar from "simplebar-react";

const AutoCompleteListBox = ({ children }: { children: ReactNode }) => (
  <SimpleBar className="max-h-64 shadow-1 rounded-xl">
    <div className="rounded-xl bg-white">{children}</div>
  </SimpleBar>
);

export default AutoCompleteListBox;
