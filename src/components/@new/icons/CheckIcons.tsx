import clsx from "clsx";
import React from "react";

export const CheckIcon1 = ({ className }: { className?: string }) => (
  <svg
    className={clsx("w-4 h-4", `fill-white stroke-grey-100`, className)}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" />
    <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" />
  </svg>
);

export const CheckIcon2 = ({ className }: { className?: string }) => (
  <svg
    className={clsx("w-4 h-4", `fill-white stroke-grey-100`, className)}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 0C1.79086 0 0 1.79086 0 4V12C0 14.2091 1.79086 16 4 16H12C14.2091 16 16 14.2091 16 12V4C16 1.79086 14.2091 0 12 0H4ZM7.21079 11.2058L12.7108 5.7058C13.0985 5.31576 13.0985 4.68584 12.7108 4.2958C12.523 4.10649 12.2674 4 12.0008 4C11.7342 4 11.4786 4.10649 11.2908 4.2958L6.50079 9.0858L4.71079 7.2958C4.52303 7.10649 4.26743 7 4.00079 7C3.73416 7 3.47856 7.10649 3.29079 7.2958C2.90307 7.68584 2.90307 8.31576 3.29079 8.7058L5.79079 11.2058C5.97856 11.3951 6.23416 11.5016 6.50079 11.5016C6.76743 11.5016 7.02303 11.3951 7.21079 11.2058Z"
      fill="#0E8B40"
    />
  </svg>
);
