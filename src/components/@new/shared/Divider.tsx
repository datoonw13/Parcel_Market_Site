import clsx from "clsx";
import React from "react";

const Divider = ({ label, className }: { label?: string; className?: string }) => (
  <div className={clsx("h-[1px] bg-[rgba(217,_217,_217,_1)] w-full relative", className)}>
    {label && (
      <p className="absolute top-[-50%] translate-y-[-50%] left-[50%] translate-x-[-50%] bg-white px-3 text-grey-800 text-sm font-medium">
        {label}
      </p>
    )}
  </div>
);

export default Divider;
