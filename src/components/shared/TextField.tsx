"use client";

import WarningCircleIcon from "@/icons/WarningCircleIcon";
import clsx from "clsx";
import { ReactNode, forwardRef } from "react";
import { ChangeHandler, FieldValues, UseFormRegister } from "react-hook-form";
import { Tooltip } from "react-tooltip";

type RegisterType = UseFormRegister<any>;

interface Props {
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  info?: string;
  endIcon?: ReactNode;
  onChange?: (value: string) => void;
  register?: any;
  name?: string;
  error?: boolean;
  helperText?: string;
  type?: string;
}

const TextField = (props: Props) => {
  const { defaultValue, label, placeholder, info, endIcon, value, onChange, register, name, error, helperText, type = "text" } = props;
  return (
    <div>
      <div className="flex items-center mb-2 gap-2">
        {label && <p className={clsx("font-medium", error ? "text-error" : "text-grey-500")}>{label}</p>}
        {info && (
          <>
            <div id="input-info" className="w-[16px]">
              <WarningCircleIcon />
            </div>
            <Tooltip anchorSelect="#input-info" content={info} className="!bg-white drop-shadow-lg rounded !text-dark-green-500" />
          </>
        )}
      </div>
      <div
        className={clsx(
          "text-grey-500 border px-4 py-3 focus-visible:outline-none rounded-lg w-full flex gap-4 bg-[#F3F4F6]",
          error ? "border-error" : "border-[#9CA3AF]"
        )}
      >
        <input
          type={type}
          defaultValue={defaultValue}
          value={value}
          placeholder={placeholder}
          className={clsx("focus-visible:outline-none w-full bg-[#F3F4F6]", error ? "text-error" : "text-grey-500")}
          onChange={(e) => onChange && onChange(e.target.value)}
          {...(register && name && { ...register(name) })}
        />
        {endIcon && endIcon}
      </div>
      {helperText && <p className={clsx("text-xs mt-2 mx-2", error ? "text-error" : "text-grey-500")}>{helperText}</p>}
    </div>
  );
};
export default TextField;
