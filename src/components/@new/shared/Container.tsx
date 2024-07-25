import clsx from "clsx";
import React, { ReactNode } from "react";

const Container = ({ children, className, maxWidth, id }: { children: ReactNode; className?: string; maxWidth?: string; id?: string }) => (
  <div className={clsx("w-full px-5 sm:px-7 md:px-10 lg:px-14 xl:px-16 mx-auto", maxWidth || "max-w-7xl", className)} id={id}>
    {children}
  </div>
);

export default Container;
