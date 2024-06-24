import clsx from "clsx";
import React from "react";

export const ArrowIconDown1 = ({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) => (
  <svg className={clsx("stroke-black w-4 h-4", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
      d="M19.92 8.95l-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
    />
  </svg>
);

export const ArrowIconUp1 = ({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) => (
  <svg className={clsx("stroke-black w-4 h-4", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
      d="M19.92 15.05L13.4 8.53c-.77-.77-2.03-.77-2.8 0l-6.52 6.52"
    />
  </svg>
);

export const ArrowIconsUnion1 = ({ className }: { className?: string }) => (
  <svg className={clsx("fill-black w-4 h-4", className)} viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.157243 6.93158C-0.0517353 6.7253 -0.0525116 6.3901 0.155509 6.18288C0.346195 5.99292 0.646137 5.97645 0.85577 6.1339L0.910553 6.18116L3.48636 8.72412L6.08945 6.1542C6.28101 5.96512 6.58103 5.95001 6.78993 6.10842L6.84449 6.15592C7.03518 6.34588 7.05042 6.64337 6.89066 6.85052L6.84276 6.90462L3.863 9.8458C3.67206 10.0343 3.37322 10.05 3.16429 9.89292L3.10969 9.8458L0.157243 6.93158Z" />
    <path d="M6.84276 3.06842C7.05174 3.2747 7.05251 3.6099 6.84449 3.81712C6.6538 4.00708 6.35386 4.02355 6.14423 3.8661L6.08945 3.81884L3.51364 1.27588L0.910554 3.8458C0.71899 4.03488 0.418974 4.04999 0.210073 3.89158L0.155509 3.84408C-0.0351763 3.65412 -0.0504151 3.35663 0.109336 3.14948L0.157243 3.09538L3.137 0.154202C3.32794 -0.0342672 3.62678 -0.0499731 3.83571 0.107085L3.89031 0.154202L6.84276 3.06842Z" />
  </svg>
);
