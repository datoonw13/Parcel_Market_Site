"use client";

import WarningCircleIcon from "@/icons/WarningCircleIcon";
import clsx from "clsx";
import { ReactNode } from "react";
import { Tooltip } from "react-tooltip";

interface Props {
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string | number;
  info?: string;
  endIcon?: ReactNode;
  startIcon?: ReactNode;
  onChange?: (value: string) => void;
  name: string;
  error?: boolean;
  helperText?: string;
  type?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

const TextField = (props: Props) => {
  const {
    defaultValue,
    label,
    placeholder,
    info,
    endIcon,
    value,
    onChange,
    name,
    error,
    helperText,
    type = "text",
    startIcon,
    disabled,
    fullWidth,
  } = props;
  const labelId = `${name}-select-label`;

  return (
    <div className={clsx(fullWidth && "w-full")}>
      <div className="flex items-center mb-2 gap-2">
        {label && <p className={clsx("font-medium", error ? "text-error" : "text-grey-500")}>{label}</p>}
        {info && (
          <>
            <div id={labelId} className="w-[16px]">
              <WarningCircleIcon />
            </div>
            <Tooltip anchorSelect={`#${labelId}`} content={info} className="!bg-white drop-shadow-lg rounded !text-dark-green-500" />
          </>
        )}
      </div>
      <div
        className={clsx(
          "text-grey-500 border px-4 py-3 focus-visible:outline-none rounded-lg w-full flex gap-4 bg-[#F3F4F6]",
          error ? "border-error" : "border-[#9CA3AF]",
          disabled && "opacity-70 cursor-not-allowed"
        )}
      >
        {startIcon && startIcon}
        <input
          disabled={disabled}
          type={type}
          defaultValue={defaultValue}
          value={value || ""}
          placeholder={placeholder}
          autoComplete="new-password"
          className={clsx(
            "focus-visible:outline-none w-full bg-[#F3F4F6]",
            error ? "text-error" : "text-grey-500",
            disabled && "opacity-70 cursor-not-allowed"
          )}
          onChange={(e) => onChange && onChange(e.target.value)}
        />
        {endIcon && endIcon}
      </div>
      {helperText && <p className={clsx("text-xs mt-2 mx-2", error ? "text-error" : "text-grey-500")}>{helperText}</p>}
    </div>
  );
};
export default TextField;
