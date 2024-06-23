"use client";

import clsx from "clsx";
import { MouseEvent, ReactElement, useEffect, useLayoutEffect, useRef } from "react";
import classes from "./textfield.module.css";

interface TextFieldProps {
  variant?: "primary" | "secondary";
  label?: string;
  placeholder?: string;
  error?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  endIcon?: ReactElement | string;
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
}

const TextField = (props: TextFieldProps) => {
  const { variant = "primary", label, placeholder = "", error, value, onChange, endIcon, disabled, onClick, onBlur } = props;
  const endIconRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const setPadding = () => {
    if (endIconRef.current && inputRef.current) {
      const { width } = endIconRef.current.getBoundingClientRect();
      const currentRightPadding = window.getComputedStyle(inputRef.current, null).getPropertyValue("padding-left");
      inputRef.current.style.paddingRight = `calc(${parseFloat(currentRightPadding) / 2}px + ${width}px)`;
    }
  };

  useLayoutEffect(() => {
    setPadding();
  }, [endIcon]);

  return (
    <div className={clsx(classes.root)} onClick={onClick}>
      <input
        className={clsx(label && classes[`input-${variant}`], classes.input, error && classes.error)}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        ref={inputRef}
        disabled={disabled}
        onBlur={onBlur}
      />
      {label && <p className={label && classes[`label-${variant}`]}>{label}</p>}
      {endIcon && (
        <div className="absolute right-0 h-full flex items-center pr-3" ref={endIconRef}>
          {endIcon}
        </div>
      )}
    </div>
  );
};

export default TextField;
