import clsx from "clsx";
import { ReactElement, ReactNode } from "react";
import classes from "./button.module.css";

type ButtonVariant = "primary" | "secondary" | "secondary-green" | "text";

interface ButtonBaseProps {
  children: string | ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

type ButtonType =
  | (ButtonBaseProps & { variant: ButtonVariant; startIcon?: never })
  | (ButtonBaseProps & { variant: "text"; startIcon?: ReactElement });

const Button = (props: ButtonType) => {
  const { children, variant = "primary", className, disabled, onClick, startIcon } = props;
  return (
    <button onClick={onClick} type="button" className={clsx(classes.root, classes[variant], className, "group")} disabled={disabled}>
      {startIcon && <div className={classes[`${variant}-start-icon`]}>{startIcon}</div>}
      {children}
    </button>
  );
};

export default Button;
