"use client";

import React, { Dispatch, ReactElement, SetStateAction, useState } from "react";
import Popper from "../../Popper";
import TextField from "../TextField";
import AutoCompleteListBox from "./AutoCompleteListBox";
import AutoCompleteListItem from "./AutoCompleteListItem";

interface AutoCompleteProps {
  options: Array<{ label: string; value: string }>;
  onChange: (value: { label: string; value: string }) => void;
  value: { label: string; value: string } | null;
  renderInput: (searchValue: string | null, setSearchValue: Dispatch<SetStateAction<string | null>>) => ReactElement;
}

const AutoComplete = ({ onChange, options, value, renderInput }: AutoCompleteProps) => {
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const filteredOptions = options.filter((el) =>
    searchValue ? el.label.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) : Boolean(el.label)
  );

  return (
    <Popper
      contentClassName="shadow-1 rounded-xl"
      anchorPlacement="bottom end"
      anchorGap={5}
      disableTransition
      onOpen={() => {
        setSearchValue(value?.label || "");
      }}
      onClose={() => {
        setSearchValue(null);
      }}
      renderButton={(open, setOpen) => <div onClick={() => setOpen(true)}>{renderInput(searchValue, setSearchValue)}</div>}
      renderContent={(closePopper) => (
        <>
          <AutoCompleteListBox>
            {filteredOptions.map((el) => (
              <AutoCompleteListItem
                key={el.value}
                selected={el?.value === value?.value}
                onClick={() => {
                  closePopper();
                  onChange(el);
                }}
              >
                {el.label}
              </AutoCompleteListItem>
            ))}
            {filteredOptions.length === 0 && <AutoCompleteListItem onClick={() => {}}>Data not found...</AutoCompleteListItem>}
          </AutoCompleteListBox>
        </>
      )}
    />
  );
};

export default AutoComplete;
