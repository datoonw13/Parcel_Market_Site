"use client";

import React, { FC, useRef, useState } from "react";
import Select from "react-select";
import { colors } from "../../../tailwind.config";

const getBorderColor = (error?: boolean, focused?: boolean) => {
  if (error) {
    return colors.error.DEFAULT;
  }
  if (focused) {
    return colors.primary.main.DEFAULT;
  }
  return colors.grey[100];
};

interface IOption {
  value: string;
  label: string;
}

interface AutoCompleteProps {
  error?: boolean;
  placeholder?: string;
  options: Array<IOption>;
  value: IOption | null;
  onValueChange?: (
    value: {
      value: string;
      label: string;
    } | null
  ) => void;
  disabled?: boolean;
}

const AutoComplete: FC<AutoCompleteProps> = ({ error, options, value, placeholder, onValueChange, disabled }) => {
  const selectRef = useRef<any>();

  return (
    <Select
      ref={selectRef}
      menuPosition="fixed"
      // menuPortalTarget={document.body}
      options={options}
      value={value}
      // menuIsOpen
      id="react-select"
      tabSelectsValue
      openMenuOnFocus
      onChange={onValueChange}
      placeholder={placeholder || ""}
      isDisabled={!!disabled}
      styles={{
        container: (baseStyles, state) => ({
          ...baseStyles,
          width: "100%",
        }),
        control: (baseStyles, state) => ({
          ...baseStyles,
          borderColor: getBorderColor(error, state.isFocused),
          borderRadius: 8,
          height: 52,
          boxShadow: "none",
          "&:hover": {
            borderColor: state.isFocused || error ? getBorderColor(error, state.isFocused) : colors.grey[200],
          },
          ...(state.isDisabled && { background: colors.grey[30], cursor: "not-allowed" }),
        }),
        singleValue: (baseStyles, state) => ({
          ...baseStyles,
          fontSize: 12,
          color: "black",
          fontWeight: 500,
        }),
        input: (baseStyles, state) => ({
          ...baseStyles,
          fontSize: 12,
          color: "black",
          fontWeight: 500,
        }),
        placeholder: (baseStyles, state) => ({
          ...baseStyles,
          fontSize: 12,
          color: colors.grey[800],
        }),
        menu: (baseStyles) => ({
          ...baseStyles,
          borderRadius: 12,
          boxShadow: "0px 8px 24px 0px rgba(0, 0, 0, 0.08)",
        }),
        menuList: (baseStyles) => ({
          ...baseStyles,
          padding: 0,
          "&>div:first-child": {
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          },
          "&>div:last-child": {
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          },
        }),
        option: (baseStyles, { isFocused, isSelected }) => ({
          ...baseStyles,
          fontSize: 12,
          // eslint-disable-next-line no-nested-ternary
          background: isFocused ? colors.primary.main[50] : isSelected ? colors.primary.main[100] : undefined,
          color: "black",
          "&:active": {
            background: colors.primary.main[100],
          },
        }),
      }}
    />
  );
};

export { AutoComplete };
