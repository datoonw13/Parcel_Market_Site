import { FC, ReactNode } from "react";
import clsx from "clsx";
import { LoadingIcon1 } from "@/components/@new/icons/LoadingIcons";

const sizes = {
  sm: "py-1 px-3 text-xs [&_.start-icon]:w-3.5 [&_.start-icon]:h-3.5 [&_.end-icon]:w-3.5 [&_.end-icon]:h-3.5",
  md: "py-2 px-4 text-sm [&_.start-icon]:w-4 [&_.start-icon]:h-4 [&_.end-icon]:w-4 [&_.end-icon]:h-4",
  lg: "py-3 px-6 text-sm [&_.start-icon]:w-4 [&_.start-icon]:h-4 [&_.end-icon]:w-4 [&_.end-icon]:h-4",
};

const primary = {
  default: `
  rounded-lg disabled:bg-grey-100 
  bg-primary-main hover:bg-primary-main-hover 
  [&_.start-icon[aria-color="fill"]]:fill-white [&_.start-icon[aria-color="stroke"]]:stroke-white
  [&disabled:_.start-icon[aria-color="fill"]]:fill-black-400 [&disabled:_.start-icon[aria-color="stroke"]]:stroke-black-400  
  [&_.end-icon[aria-color="fill"]]:fill-white [&_.end-icon[aria-color="stroke"]]:stroke-white 
  [&:disabled_.end-icon[aria-color="fill"]]:fill-black-400 [&disabled:_.end-icon[aria-color="stroke"]]:stroke-black-400 
  text-white disabled:text-black-400
  `,
  error: `
  rounded-lg disabled:bg-grey-100 
  bg-error hover:bg-error-hover 
  [&_.start-icon[aria-color="fill"]]:fill-white [&_.start-icon[aria-color="stroke"]]:stroke-white
  disabled: [&_.start-icon[aria-color="fill"]]:fill-white [&_.start-icon[aria-color="stroke"]]:stroke-white  
  [&_.end-icon[aria-color="fill"]]:fill-white [&_.end-icon[aria-color="stroke"]]:stroke-white 
  text-white disabled:text-black-400
  `,
};

const secondary = {
  default: `
  disabled:bg-grey-50
  rounded-lg
  outline outline-[1px] outline-grey-100 disabled:!outline-[2px]
  [&_.start-icon[aria-color="fill"]]:fill-black [&_.start-icon[aria-color="stroke"]]:stroke-black
  [&:hover_.start-icon[aria-color="fill"]]:fill-black-400 [&:hover_.start-icon[aria-color="stroke"]]:stroke-black-400
  [&_.end-icon[aria-color="fill"]]:fill-black [&_.end-icon[aria-color="stroke"]]:stroke-black
  [&:hover_.end-icon[aria-color="fill"]]:fill-black-400 [&:hover_.end-icon[aria-color="stroke"]]:stroke-black-400
  hover:text-black-400 
  `,
  error: `
  disabled:bg-grey-50
  rounded-lg
  outline outline-[1px] outline-error disabled:!outline-[2px] disabled:outline-grey-100
  [&_.start-icon[aria-color="fill"]]:fill-error [&_.start-icon[aria-color="stroke"]]:stroke-error
  [&:hover_.start-icon[aria-color="fill"]]:fill-error-hover [&:hover_.start-icon[aria-color="stroke"]]:stroke-error-hover
  [&:disabled.start-icon[aria-color="fill"]]:fill-black [&:disabled.start-icon[aria-color="stroke"]]:stroke-black
  [&_.end-icon[aria-color="fill"]]:fill-error [&_.end-icon[aria-color="stroke"]]:stroke-error
  [&:hover_.end-icon[aria-color="fill"]]:fill-error-hover [&:hover_.end-icon[aria-color="stroke"]]:stroke-error-hover
  [&:disabled_.end-icon[aria-color="fill"]]:fill-black [&:disabled_.end-icon[aria-color="stroke"]]:stroke-black
  text-error hover:text-error-hover disabled:text-black 
  `,
};

const buttonTypes = {
  primary,
  secondary: secondary,
  text: primary,
};

type ButtonColors = "default" | "error";
type ButtonVariant = "primary" | "secondary" | "text";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode,
  color?: ButtonColors;
  variant?: ButtonVariant;
  size?: ButtonSize;
  startIcon?: FC<{ className: string }>;
  endIcon?: FC<{ className: string }>;
  disabled?: boolean,
  onClick?: VoidFunction
}

const Button: FC<ButtonProps> = ({ color = "default", size = "lg", variant = "primary", startIcon: StartIcon, endIcon: EndIcon, children, disabled, onClick }) => (
  <button
    type="button"
    className={clsx("flex items-center justify-center h-fit gap-1.5 transition-all duration-100 disabled:pointer-events-none font-medium leading-6", sizes[size], buttonTypes[variant][color])}
    disabled={disabled}
    onClick={onClick}
  >
    {StartIcon && <StartIcon className="start-icon transition-all duration-100" />}
    {children}
    {EndIcon && <EndIcon className="end-icon transition-all duration-100" />}
    <LoadingIcon1 className="loading-icon" />
  </button>
);

export default Button;
