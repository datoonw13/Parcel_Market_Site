import React, { FC } from "react";
import clsx from "clsx";
import classes from "./radio-button.module.css";

interface RadioButtonProps {
  name: string;
  checked: boolean;
  onChange: (value?: boolean) => void;
  label?: string;
  labelClassName?: string;
}
const RadioButton: FC<RadioButtonProps> = ({ name, checked, onChange, label, labelClassName }) => (
  <div className="flex items-center gap-3 cursor-pointer">
    <input className={classes.root} type="radio" id={name} checked={checked} onChange={() => {}} onClick={(e) => onChange()} />
    {label && (
      <label className={clsx("font-medium text-sm", labelClassName)} htmlFor={name}>
        {label}
      </label>
    )}
  </div>
);

export default RadioButton;
