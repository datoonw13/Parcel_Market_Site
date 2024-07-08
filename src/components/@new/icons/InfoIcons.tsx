import clsx from "clsx";

export const InfoIcon1 = ({ className, color = "black" }: { className?: string; color?: string }) => (
  <svg
    aria-label="fill"
    className={clsx("w-4 h-4", `fill-${color}`, className)}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7 0C3.15 0 0 3.15 0 7C0 10.85 3.15 14 7 14C10.85 14 14 10.85 14 7C14 3.15 10.85 0 7 0ZM7.7 10.15C7.7 10.5 7.4375 10.85 7 10.85C6.5625 10.85 6.3 10.5 6.3 10.15V5.95C6.3 5.6 6.65 5.25 7 5.25C7.35 5.25 7.7 5.5125 7.7 5.95V10.15ZM7 4.55C6.65 4.55 6.3 4.2 6.3 3.85C6.3 3.5 6.65 3.15 7 3.15C7.35 3.15 7.7 3.5 7.7 3.85C7.7 4.2 7.35 4.55 7 4.55Z" />
  </svg>
);
