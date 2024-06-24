import clsx from "clsx";
import React from "react";

export const ArrowIconDown1 = ({ className }: { className?: string }) => (
  <svg className={clsx("stroke-black w-4 h-4", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
      d="M19.92 8.95l-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
    />
  </svg>
);

export const ArrowIconUp1 = ({ className }: { className?: string }) => (
  <svg className={clsx("stroke-black w-4 h-4", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
      d="M19.92 15.05L13.4 8.53c-.77-.77-2.03-.77-2.8 0l-6.52 6.52"
    />
  </svg>
);
