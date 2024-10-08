import React, { FC, ReactNode } from "react";
import clsx from "clsx";
import classes from "./radio-button.module.css";

interface RadioButtonProps {
  name: string;
  checked: boolean;
  onChange: (value?: boolean) => void;
  label?: string | ReactNode;
  labelClassName?: string;
  rootClassName?: string;
}
const RadioButton: FC<RadioButtonProps> = ({ name, checked, onChange, label, labelClassName, rootClassName }) => (
  <div className={clsx("flex items-center gap-3 cursor-pointer w-fit", rootClassName)} onClick={(e) => onChange()}>
    <input className={classes.root} type="radio" id={name} checked={checked} onChange={() => {}} />
    {label && <label className={clsx("font-medium text-sm cursor-pointer", labelClassName)}>{label}</label>}
  </div>
);

export default RadioButton;
