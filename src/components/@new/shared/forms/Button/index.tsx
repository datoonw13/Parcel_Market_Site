import clsx from "clsx";
import { ReactElement } from "react";
import classes from "./button.module.css";

interface ButtonTypes {
  variant?: "primary" | "secondary" | "text";
  children: string | ReactElement;
}

const Button = (props: ButtonTypes) => {
  const { children, variant = "primary" } = props;
  return (
    <button type="button" className={clsx(classes.root, classes[variant])}>
      {children}
    </button>
  );
};

export default Button;
