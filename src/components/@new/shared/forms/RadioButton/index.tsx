import React, { FC, ReactNode } from "react";
import clsx from "clsx";
import classes from "./radio-button.module.css";

interface RadioButtonProps {
  name: string;
  checked: boolean;
  onChange: (value?: boolean) => void;
  label?: string | ReactNode;
  labelClassName?: string;
}
const RadioButton: FC<RadioButtonProps> = ({ name, checked, onChange, label, labelClassName }) => (
  <div className="flex items-center gap-3 cursor-pointer" onClick={(e) => onChange()}>
    <input className={classes.root} type="radio" id={name} checked={checked} onChange={() => {}} />
    {label && (
      <label className={clsx("font-medium text-sm cursor-pointer", labelClassName)} htmlFor={name}>
        {label}
      </label>
    )}
  </div>
);

export default RadioButton;
