"use client";

import React, { ReactNode } from "react";
import SimpleBar from "simplebar-react";

const AutoCompleteListBox = ({ children }: { children: ReactNode }) => (
  <SimpleBar className="max-h-80">
    <div className="rounded-xl bg-white">{children}</div>
  </SimpleBar>
);

export default AutoCompleteListBox;
