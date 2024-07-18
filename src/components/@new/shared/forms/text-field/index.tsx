"use client";

import clsx from "clsx";
import { MouseEvent, ReactElement, useLayoutEffect, useRef } from "react";
import { NumericFormat } from "react-number-format";
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
  endIconClasses?: string;
  decimalScale?: number;
  suffix?: string;
  prefix?: string;
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
    endIconClasses,
    decimalScale,
    suffix,
    prefix,
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
    onChange(newValue);
  };

  useLayoutEffect(() => {
    setPadding();
  }, [endIcon]);

  return (
    <div className={clsx(classes.root, className)} onClick={(e) => !disabled && onClick && onClick(e)}>
      {type === "number" ? (
        <NumericFormat
          className={clsx(
            "group",
            label && classes[`input-${variant}`],
            classes.input,
            error && classes.error,
            disabled && "cursor-not-allowed",
            required && classes["required-placeholder"],
            `[&+.placeholder]:text-grey-800 
          [&+.placeholder]:text-xs 
          [&+.placeholder]:absolute 
          [&+.placeholder]:pointer-events-none 
          [&+.placeholder]:top-[50%] 
          [&+.placeholder]:translate-y-[-50%] 
          [&+.placeholder]:left-2 
          [&+.placeholder]:px-1.5 
          [&+.placeholder]:font-medium
          [&:focus+.placeholder]:text-grey-800
          [&:not(:placeholder-shown)+.placeholder]:hidden
          `
          )}
          value={value}
          onValueChange={e => handleChange(e.value)}
          getInputRef={inputRef}
          placeholder=" "
          disabled={disabled}
          onBlur={onBlur}
          defaultValue={defaultValue}
          readOnly={readOnly}
          type="text"
          name={name}
          autoComplete="new-password"
          decimalScale={decimalScale}
          suffix={suffix}
          prefix={prefix}
        />
      ) : (
        <input
          className={clsx(
            "group",
            label && classes[`input-${variant}`],
            classes.input,
            error && classes.error,
            disabled && "cursor-not-allowed",
            required && classes["required-placeholder"],
            `[&+.placeholder]:text-grey-800 
        [&+.placeholder]:text-xs 
        [&+.placeholder]:absolute 
        [&+.placeholder]:pointer-events-none 
        [&+.placeholder]:top-[50%] 
        [&+.placeholder]:translate-y-[-50%] 
        [&+.placeholder]:left-2 
        [&+.placeholder]:px-1.5 
        [&+.placeholder]:font-medium
        [&:focus+.placeholder]:text-grey-800
        [&:not(:placeholder-shown)+.placeholder]:hidden
        `
          )}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          ref={inputRef}
          placeholder=" "
          disabled={disabled}
          onBlur={onBlur}
          defaultValue={defaultValue}
          readOnly={readOnly}
          name={name}
          type={type}
          autoComplete="new-password"
        />
      )}

      {label && (
        <p className={clsx(label && classes[`label-${variant}`], "pointer-events-none")}>
          {label}
          {required && <span className="text-error">*</span>}
        </p>
      )}
      {placeholder && (
        <p className="placeholder">
          {placeholder}
          {required && <span className="text-error">*</span>}
        </p>
      )}
      {endIcon && (
        <div
          className={clsx(
            "absolute right-0 h-full flex items-center pr-3",
            disabled && "cursor-not-allowed pointer-events-none",
            endIconClasses
          )}
          ref={endIconRef}
        >
          {endIcon}
        </div>
      )}
    </div>
  );
};

export default TextField;
