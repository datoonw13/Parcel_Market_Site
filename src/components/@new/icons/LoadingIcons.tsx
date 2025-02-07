import clsx from "clsx";
import React from "react";

export const LoadingIcon1 = ({ className, color = "black" }: { className?: string; color?: string }) => (
  <svg
    aria-label="fill"
    className={clsx(`w-4 h-4 animate-spin`, `fill-${color}`, className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z">
      {/* <animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12" /> */}
    </path>
  </svg>
);

export const LoadingIcon2 = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none">
    <defs>
      <linearGradient id="spinner-secondHalf">
        <stop offset="0%" stop-opacity="0" stop-color="currentColor" />
        <stop offset="100%" stop-opacity="0.5" stop-color="currentColor" />
      </linearGradient>
      <linearGradient id="spinner-firstHalf">
        <stop offset="0%" stop-opacity="1" stop-color="currentColor" />
        <stop offset="100%" stop-opacity="0.5" stop-color="currentColor" />
      </linearGradient>
    </defs>

    <g stroke-width="8">
      <path stroke="url(#spinner-secondHalf)" d="M 4 100 A 96 96 0 0 1 196 100" />
      <path stroke="url(#spinner-firstHalf)" d="M 196 100 A 96 96 0 0 1 4 100" />

      <path stroke="currentColor" stroke-linecap="round" d="M 4 100 A 96 96 0 0 1 4 98" />
    </g>

    {/* <animateTransform from="0 0 0" to="360 0 0" attributeName="transform" type="rotate" repeatCount="indefinite" dur="1300ms" /> */}
  </svg>
);
