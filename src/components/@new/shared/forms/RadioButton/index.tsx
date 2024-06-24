import React, { FC } from "react";
import classes from "./radio-button.module.css";

interface RadioButtonProps {
  name: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}
const RadioButton: FC<RadioButtonProps> = ({ name, checked, onChange, label }) => (
  <div className="flex items-center gap-3">
    <input className={classes.root} type="radio" id={name} checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <label className="font-medium text-sm" htmlFor={name}>
      {label}
    </label>
  </div>
);

export default RadioButton;
