import clsx from "clsx";

export const AddIcon1 = ({ className, color = "black" }: { className?: string; color?: string }) => (
  <svg aria-label="fill" className={clsx(`w-4 h-4`, `fill-${color}`, className)} viewBox="0 0 16 16" fill="none">
    <path d="M7.875 0.875C7.875 0.391751 7.48325 0 7 0C6.51675 0 6.125 0.391751 6.125 0.875V6.12492L0.875 6.12492C0.391751 6.12492 0 6.51667 0 6.99992C0 7.48317 0.39175 7.87492 0.875 7.87492L6.125 7.87492V13.125C6.125 13.6082 6.51675 14 7 14C7.48325 14 7.875 13.6082 7.875 13.125V7.87492L13.125 7.87492C13.6082 7.87492 14 7.48317 14 6.99992C14 6.51667 13.6082 6.12492 13.125 6.12492L7.875 6.12492V0.875Z" />
  </svg>
);