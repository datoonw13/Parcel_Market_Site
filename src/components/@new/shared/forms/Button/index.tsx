import clsx from "clsx";
import { ReactElement, ReactNode } from "react";
import { LoadingIcon1 } from "@/components/@new/icons/LoadingIcons";
import classes from "./button.module.css";

type ButtonVariant = "primary" | "primary-error" | "secondary" | "secondary-green" | "text";

interface ButtonBaseProps {
  children: string | ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  loading?: boolean;
}

type ButtonType =
  | (ButtonBaseProps & { variant?: ButtonVariant; startIcon?: never })
  | (ButtonBaseProps & { variant?: "text"; startIcon?: ReactElement });

const Button = (props: ButtonType) => {
  const { children, variant = "primary", className, disabled, onClick, startIcon, loading } = props;
  return (
    <button
      onClick={onClick}
      type="button"
      className={clsx(classes.root, classes[variant], className, "group")}
      disabled={disabled || loading}
    >
      {startIcon && <div className={classes[`${variant}-start-icon`]}>{startIcon}</div>}
      {loading ? <LoadingIcon1 className="fill-grey-400" /> : children}
    </button>
  );
};

export default Button;
