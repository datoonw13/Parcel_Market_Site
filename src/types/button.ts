export type ButtonType = "primary" | "secondary" | "tertiary" | "text";

export interface ButtonProps {
  type?: ButtonType;
  disabled?: boolean;
}
