import SpinnerIcon from "@/icons/SpinnerIcon";
import clsx from "clsx";

import { ReactNode } from "react";

type ButtonType = "primary" | "alternate" | "tertiary" | "none";

interface ButtonProps {
  type?: ButtonType;
  disabled?: boolean;
  children: ReactNode;
  classNames?: string;
  startIcon?: ReactNode;
  onClick?: () => void;
  loading?: boolean;
  color?: "error" | "default";
  disableStartIconColor?: boolean;
}

const primaryButtonStyles = (color: ButtonProps["color"]) => {
  if (color === "error") {
    return `text-white bg-error hover:bg-error-900`;
  }
  return `text-dark-green hover:text-white bg-green hover:bg-green-900`;
};

const alternateButtonStyles = (color: ButtonProps["color"]) => {
  if (color === "error") {
    return `bg-error-100 hover:bg-error-300 text-white`;
  }
  return `bg-green-100 hover:bg-green-300 text-dark-green`;
};

const tertiaryButtonStyles = (color: ButtonProps["color"]) => {
  if (color === "error") {
    return `border border-solid border-error bg-white hover:bg-error-100 text-error hover:text-white`;
  }
  return `text-dark-green border border-solid border-green bg-white hover:bg-green-300`;
};

const buttonStyles = (color: ButtonProps["color"], type: ButtonProps["type"], disableStartIconColor?: boolean) => {
  const baseClassnames = `relative font-semibold p-4 border-transparent  disabled:border-grey-200 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:text-dark-green-100 disabled:cursor-not-allowed disabled:bg-grey-200`;
  const startIconClassnames = `[&_div_svg]:w-[24px] ${
    disableStartIconColor
      ? ""
      : "[&_div_svg_*]:stroke-dark-green [&_div_svg_*]:hover:strokeWhite [&_div_svg_*]:disabled:stroke-dark-green-100 [&_div_svg_*]:transition-all"
  }`;
  let classNames = `${baseClassnames} ${startIconClassnames}`;
  if (type === "primary") {
    classNames += ` ${primaryButtonStyles(color)}`;
  }
  if (type === "alternate") {
    classNames += ` ${alternateButtonStyles(color)}`;
  }
  if (type === "tertiary") {
    classNames += ` ${tertiaryButtonStyles(color)}`;
  }
  return classNames;
};

const Button = (params: ButtonProps) => {
  const {
    type = "primary",
    color = "default",
    disabled,
    children,
    classNames,
    startIcon: StartIcon,
    onClick,
    loading,
    disableStartIconColor,
  } = params;

  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(buttonStyles(color, type, disableStartIconColor), classNames)}
    >
      {StartIcon && <div className={clsx(loading ? "opacity-0" : "opacity-100")}>{StartIcon}</div>}
      <div className={clsx(loading ? "opacity-0" : "opacity-100")}> {children}</div>
      {loading && (
        <div className="w-[40px] absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] flex justify-center">
          <SpinnerIcon color="green" />
        </div>
      )}
    </button>
  );
};

export default Button;
