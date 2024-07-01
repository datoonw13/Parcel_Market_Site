import { ButtonHTMLAttributes, FC, ReactNode, forwardRef } from "react";
import clsx from "clsx";
import { LoadingIcon1 } from "@/components/@new/icons/LoadingIcons";

const sizes = {
  sm: "py-1 px-3 text-xs [&>svg]:w-3.5 [&>svg]:h-3.5",
  md: "py-2 px-4 text-sm [&>svg]:w-4 [&>svg]:h-4",
  lg: "py-3 px-6 text-sm [&>svg]:w-4 [&>svg]:h-4",
};

const primary = {
  default: `
  rounded-lg disabled:bg-grey-100 
  bg-primary-main hover:bg-primary-main-hover 
  [&>svg[aria-label="fill"]]:fill-white [&>svg[aria-label="stroke"]]:stroke-white
  [&:disabled>svg[aria-label="fill"]]:fill-black-400 [&:disabled>svg[aria-label="stroke"]]:stroke-black-400  
  text-white disabled:text-black-400
  `,
  error: `
  rounded-lg disabled:bg-grey-100 
  bg-error hover:bg-error-hover 
  [&>svg[aria-label="fill"]]:fill-white [&>svg[aria-label="stroke"]]:stroke-white
  [&:disabled>svg[aria-label="fill"]]:fill-black-400 [&:disabled>svg[aria-label="stroke"]]:stroke-black-400  
  text-white disabled:text-black-400
  `,
};

const secondary = {
  default: `
  disabled:bg-grey-50
  rounded-lg
  outline outline-[1px] outline-grey-100 disabled:!outline-[2px]
  [&>svg[aria-label="fill"]]:fill-black [&>svg[aria-label="stroke"]]:stroke-black
  [&:hover>svg[aria-label="fill"]]:fill-black-400 [&:hover>svg[aria-label="stroke"]]:stroke-black-400
  hover:text-black-400 
  `,
  error: `
  disabled:bg-grey-50
  rounded-lg
  outline outline-[1px] outline-error disabled:!outline-[2px] disabled:outline-grey-100
  [&>svg[aria-label="fill"]]:fill-error [&>svg[aria-label="stroke"]]:stroke-error
  [&:hover>svg[aria-label="fill"]]:fill-error-400 [&:hover>svg[aria-label="stroke"]]:stroke-error-400
  [&:disabled>svg[aria-label="fill"]]:fill-black [&:disabled>svg[aria-label="stroke"]]:stroke-black
  text-error hover:text-error-400 disabled:text-black 
  `,
};

const buttonTypes = {
  primary,
  secondary,
  text: primary,
};

type ButtonColors = "default" | "error";
type ButtonVariant = "primary" | "secondary" | "text";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  color?: ButtonColors;
  variant?: ButtonVariant;
  size?: ButtonSize;
  startIcon?: FC<{ className: string }>;
  endIcon?: FC<{ className: string }>;
  disabled?: boolean;
  onClick?: () => void;
  loading?: boolean;
  className?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      color = "default",
      size = "lg",
      variant = "primary",
      startIcon: StartIcon,
      endIcon: EndIcon,
      children,
      disabled,
      onClick,
      loading,
      className,
      type = "button",
    },
    ref
  ) => (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type || "submit"}
      ref={ref}
      className={clsx(
        "flex items-center justify-center h-fit gap-1.5 transition-all duration-100 disabled:pointer-events-none font-medium leading-6",
        sizes[size],
        buttonTypes[variant][color],
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {StartIcon && <StartIcon className={clsx("start-icon transition-all duration-100", loading && "opacity-0")} />}
      <div className={clsx(loading && "opacity-0")}>{children}</div>
      {EndIcon && <EndIcon className={clsx("end-icon transition-all duration-100", loading && "opacity-0")} />}
      {loading && <LoadingIcon1 className="loading-icon absolute start-icon transition-all duration-100" />}
    </button>
  )
);

export default Button;
