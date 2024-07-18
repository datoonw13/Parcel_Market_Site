"use client";

import React, { FC, useState } from "react";
import RadioButton from "@/components/@new/shared/forms/RadioButton";
import LabelWithInfo from "@/components/@new/shared/label-with-info";
import TextField from "@/components/@new/shared/forms/text-field";

interface OfferEarnestMoneyFieldProps {
  error?: boolean;
  onChange: (value: number | null) => void;
}

const OfferEarnestMoneyField: FC<OfferEarnestMoneyFieldProps> = ({ onChange, error }) => {
  const [showInput, setShowInput] = useState(false);
  const [value, setValue] = useState<string | null>("");

  return (
    <div className="flex flex-col gap-3">
      <LabelWithInfo
        label="Earnest Money"
        description="The deposit you are willing to put down on the land while under contract to close."
        error={!!error}
      />
      <div className="flex flex-col gap-4">
        <RadioButton
          name="earnest-money-none"
          onChange={() => {
            setValue(null);
            onChange(null);
            setShowInput(false);
          }}
          checked={!showInput && value === null}
          label="None"
        />
        <RadioButton
          name="earnest-money-5"
          onChange={() => {
            setValue("5");
            onChange(5);
            setShowInput(false);
          }}
          checked={!showInput && value === "5"}
          label="5%"
        />
        <RadioButton
          name="earnest-money-10"
          onChange={() => {
            setValue("10");
            onChange(10);
            setShowInput(false);
          }}
          checked={!showInput && value === "10"}
          label="10%"
        />
        <RadioButton
          name="earnest-money-20"
          onChange={() => {
            setValue("20");
            onChange(20);
            setShowInput(false);
          }}
          checked={!showInput && value === "20"}
          label="20%"
        />
        <RadioButton
          name="earnest-money-other"
          onChange={() => {
            setShowInput(true);
          }}
          checked={showInput}
          label="Other"
        />
        {showInput && (
          <TextField
            placeholder="Type here"
            value={value ? value?.toString() : ""}
            type="number"
            onChange={(value) => {
              setValue(value);
              onChange(Number(value));
            }}
          />
        )}
      </div>
    </div>
  );
};

export default OfferEarnestMoneyField;
