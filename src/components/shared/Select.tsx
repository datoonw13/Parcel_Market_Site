"use client";

import { useId } from "react";
import ReactSelect, { components } from "react-select";
import clsx from "clsx";
import WarningCircleIcon from "@/icons/WarningCircleIcon";
import { Tooltip } from "react-tooltip";
import { randomUUID } from "crypto";
import uuid from "short-uuid";
import { colors } from "../../../tailwind.config";

const Control = (props: any) => {
  const Co = components.Control;
  return <Co {...props} className="!px-4 !py-3 !rounded-lg !w-full" />;
};

interface Props {
  label?: string;
  info?: string;
  helperText?: string;
  error?: boolean;
  placeholder?: string;
  name: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  isClearable?: boolean;
  onChange: (value: string | null) => void;
  value: { value: string; label: string } | null;
}

const Select = (props: Props) => {
  const { error, helperText, info, label, placeholder = "", name, options, disabled, isClearable, onChange, value } = props;
  const labelId = `${name}-select-label`;
  return (
    <div className="w-full">
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
      <ReactSelect
        instanceId={useId()}
        isClearable={!!isClearable}
        isDisabled={disabled}
        options={options}
        components={{ Control, IndicatorSeparator: null }}
        classNamePrefix="select"
        placeholder={placeholder}
        onChange={(newValue) => onChange(newValue?.value || null)}
        value={value}
        styles={{
          control: (provided, state) => ({
            ...provided,
            boxShadow: "none",
            border: `1px solid ${error ? colors.error : "#9CA3AF"}`,
            background: "#F3F4F6",
            cursor: disabled ? "not-allowed" : "pointer",
            pointerEvents: "auto",
          }),
          valueContainer: (provided, state) => ({
            ...provided,
            boxShadow: "none",
            padding: 0,
            "& > div": {
              padding: 0,
              margin: 0,
            },
            "& > div:not(.select__placeholder)": {
              color: colors.grey["400"],
            },
          }),
          indicatorsContainer: (provided, state) => ({
            ...provided,
            "& > div": {
              padding: 0,
              margin: 0,
            },
          }),
        }}
      />
      {helperText && <p className={clsx("text-xs mt-2 mx-2", error ? "text-error" : "text-grey-500")}>{helperText}</p>}
    </div>
  );
};

export default Select;
