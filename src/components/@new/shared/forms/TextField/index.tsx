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
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  onBlur?: () => void;
  defaultValue?: string;
  className?: string;
  readOnly?: boolean;
}

const TextField = (props: TextFieldProps) => {
  const {
    variant = "primary",
    label,
    placeholder = "",
    error,
    value,
    onChange,
    endIcon,
    disabled,
    onClick,
    onBlur,
    defaultValue,
    className,
    readOnly,
  } = props;
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
    <div className={clsx(classes.root, className)} onClick={(e) => !disabled && onClick && onClick(e)}>
      <input
        className={clsx(label && classes[`input-${variant}`], classes.input, error && classes.error, disabled && "cursor-not-allowed")}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        ref={inputRef}
        disabled={disabled}
        onBlur={onBlur}
        defaultValue={defaultValue}
        readOnly={readOnly}
        onFocus={onFocus}
      />
      {label && <p className={label && classes[`label-${variant}`]}>{label}</p>}
      {endIcon && (
        <div
          className={clsx("absolute right-0 h-full flex items-center pr-3", disabled && "cursor-not-allowed pointer-events-none")}
          ref={endIconRef}
        >
          {endIcon}
        </div>
      )}
    </div>
  );
};

export default TextField;
