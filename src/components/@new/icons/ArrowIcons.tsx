import clsx from "clsx";
import React from "react";

export const ArrowIconDown1 = ({
  className,
  strokeWidth = 1.5,
  color = "black",
}: {
  className?: string;
  strokeWidth?: number;
  color?: string;
}) => (
  <svg
    aria-label="stroke"
    className={clsx("w-4 h-4", `stroke-${color}`, className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
      d="M19.92 8.95l-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
    />
  </svg>
);

export const ArrowIconUp1 = ({
  className,
  strokeWidth = 1.5,
  color = "black",
}: {
  className?: string;
  strokeWidth?: number;
  color?: string;
}) => (
  <svg
    aria-label="stroke"
    className={clsx("w-4 h-4", `stroke-${color}`, className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
      d="M19.92 15.05L13.4 8.53c-.77-.77-2.03-.77-2.8 0l-6.52 6.52"
    />
  </svg>
);

export const ArrowIconLeft1 = ({ className, color = "black" }: { className?: string; color?: string }) => (
  <svg
    aria-label="fill"
    className={clsx("w-4 h-4", `fill-${color}`, className)}
    viewBox="0 0 7 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6.45554 0.705384C6.84481 1.09466 6.84516 1.72569 6.45631 2.11538L3.28495 5.29366C2.89546 5.68401 2.89546 6.31599 3.28495 6.70634L6.45631 9.88462C6.84516 10.2743 6.84481 10.9053 6.45554 11.2946C6.06597 11.6842 5.43435 11.6842 5.04477 11.2946L0.457263 6.70711C0.0667391 6.31658 0.0667391 5.68342 0.457263 5.29289L5.04477 0.705384C5.43435 0.315811 6.06597 0.315811 6.45554 0.705384Z" />
  </svg>
);

export const ArrowIconRight1 = ({ className, color = "black" }: { className?: string; color?: string }) => (
  <svg
    aria-label="fill"
    className={clsx("w-4 h-4", `fill-${color}`, className)}
    viewBox="0 0 7 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0.544459 0.705384C0.155187 1.09466 0.154843 1.72569 0.543691 2.11538L3.71505 5.29366C4.10454 5.68401 4.10454 6.31599 3.71505 6.70634L0.54369 9.88462C0.154842 10.2743 0.155187 10.9053 0.544459 11.2946C0.934032 11.6842 1.56565 11.6842 1.95523 11.2946L6.54274 6.70711C6.93326 6.31658 6.93326 5.68342 6.54274 5.29289L1.95523 0.705384C1.56565 0.315811 0.934032 0.315811 0.544459 0.705384Z" />
  </svg>
);

export const ArrowIconsUnion1 = ({ className, color = "black" }: { className?: string; color?: string }) => (
  <svg
    aria-label="fill"
    className={clsx("w-4 h-4", `fill-${color}`, className)}
    viewBox="0 0 7 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0.157243 6.93158C-0.0517353 6.7253 -0.0525116 6.3901 0.155509 6.18288C0.346195 5.99292 0.646137 5.97645 0.85577 6.1339L0.910553 6.18116L3.48636 8.72412L6.08945 6.1542C6.28101 5.96512 6.58103 5.95001 6.78993 6.10842L6.84449 6.15592C7.03518 6.34588 7.05042 6.64337 6.89066 6.85052L6.84276 6.90462L3.863 9.8458C3.67206 10.0343 3.37322 10.05 3.16429 9.89292L3.10969 9.8458L0.157243 6.93158Z" />
    <path d="M6.84276 3.06842C7.05174 3.2747 7.05251 3.6099 6.84449 3.81712C6.6538 4.00708 6.35386 4.02355 6.14423 3.8661L6.08945 3.81884L3.51364 1.27588L0.910554 3.8458C0.71899 4.03488 0.418974 4.04999 0.210073 3.89158L0.155509 3.84408C-0.0351763 3.65412 -0.0504151 3.35663 0.109336 3.14948L0.157243 3.09538L3.137 0.154202C3.32794 -0.0342672 3.62678 -0.0499731 3.83571 0.107085L3.89031 0.154202L6.84276 3.06842Z" />
  </svg>
);
