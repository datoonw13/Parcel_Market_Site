import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary-main text-white hover:bg-primary-main-hover disabled:bg-grey-100 disabled:text-black/40 disabled:pointer-events-none",
        secondary: `disabled:bg-grey-50 rounded-lg outline outline-[1px] outline-grey-100 disabled:!outline-[2px] hover:text-black-400 disabled:pointer-events-none`,
      },
      size: {
        default: "h-12 px-4 py-3",
        sm: "h-8 rounded-md px-3",
        lg: "h-14 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, loading, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} disabled={props.disabled || loading}>
      <span className={cn(loading && "opacity-0")}>{props.children}</span>
      {loading && <Spinner />}
    </Comp>
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white absolute" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);
