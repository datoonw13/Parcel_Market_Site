"use client";

import clsx from "clsx";
import { MouseEvent, ReactElement, useEffect, useLayoutEffect, useRef, useState } from "react";
import { numericInput } from "@/helpers/common";
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
  type?: "text" | "number" | "password";
  name?: string;
  required?: boolean;
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
    type = "text",
    name,
    required,
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

  const handleChange = (newValue: string) => {
    if (!onChange) {
      return;
    }
    if (type === "number") {
      const { valid, result } = numericInput(newValue);
      if (valid) {
        onChange(result);
      }
    } else {
      onChange(newValue);
    }
  };

  useLayoutEffect(() => {
    setPadding();
  }, [endIcon]);

  return (
    <div className={clsx(classes.root, className)} onClick={(e) => !disabled && onClick && onClick(e)}>
      <input
        className={clsx(
          label && classes[`input-${variant}`],
          classes.input,
          error && classes.error,
          disabled && "cursor-not-allowed",
          required && classes["required-placeholder"],
          "placeholder:text-grey-800"
        )}
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        ref={inputRef}
        disabled={disabled}
        onBlur={onBlur}
        defaultValue={defaultValue}
        readOnly={readOnly}
        type={type === "number" ? "text" : type}
        name={name}
      />
      {label && (
        <p className={clsx(label && classes[`label-${variant}`], "pointer-events-none")}>
          {label}
          {required && <span className="text-error">*</span>}
        </p>
      )}
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
