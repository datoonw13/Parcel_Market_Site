import { ReactNode } from "react";

export type ButtonType = "primary" | "secondary" | "tertiary" | "text";

export interface ButtonProps {
  type?: ButtonType;
  disabled?: boolean;
  children: ReactNode;
  classNames?: string;
  startIcon?: ReactNode;
}
