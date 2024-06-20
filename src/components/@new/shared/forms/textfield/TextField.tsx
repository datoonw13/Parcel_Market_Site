"use client";

import clsx from "clsx";
import classes from "./textfield.module.css";

interface TextFieldProps {
  variant: "primary" | "secondary";
  label?: string;
  placeholder?: string;
  error?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

const TextField = (props: TextFieldProps) => {
  const { variant = "primary", label, placeholder = "", error, value, onChange } = props;
  return (
    <div className={clsx(classes.root)}>
      <input
        className={clsx(label && classes[`input-${variant}`], classes.input, error && classes.error)}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
      {label && <p className={label && classes[`label-${variant}`]}>{label}</p>}
    </div>
  );
};

export default TextField;
