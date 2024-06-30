import clsx from "clsx";
import React, { ReactNode } from "react";

const Container = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={clsx("w-full px-5 sm:px-8 md:px-16 max-w-7xl m-auto", className)}>{children}</div>
);

export default Container;
