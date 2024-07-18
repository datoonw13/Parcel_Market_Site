"use client";

import RadioButton from "@/components/@new/shared/forms/RadioButton";
import LabelWithInfo from "@/components/@new/shared/label-with-info";
import React, { FC, useState } from "react";
import TextField from "@/components/@new/shared/forms/text-field";

interface OfferInspectionPeriodFieldProps {
  error?: boolean;
  onChange: (value: number | null) => void;
}

const OfferInspectionPeriodField: FC<OfferInspectionPeriodFieldProps> = ({ onChange, error }) => {
  const [showInput, setShowInput] = useState(false);
  const [value, setValue] = useState<string | null>("");
  return (
    <div className="flex flex-col gap-3">
      <LabelWithInfo
        error={!!error}
        label="Inspection Period"
        description="The amount of time you need to inspect the property and receive a full refund on your deposit should you not move forward with the sale."
      />
      <div className="flex flex-col gap-4">
        <RadioButton
          name="inspection-period-none"
          onChange={() => {
            setValue(null);
            onChange(null);
            setShowInput(false);
          }}
          checked={!showInput && value === null}
          label="None"
        />
        <RadioButton
          name="inspection-period-5"
          onChange={() => {
            setValue("10");
            onChange(10);
            setShowInput(false);
          }}
          checked={!showInput && value === "10"}
          label="10 Days"
        />
        <RadioButton
          name="inspection-period-10"
          onChange={() => {
            setValue("20");
            onChange(20);
            setShowInput(false);
          }}
          checked={!showInput && value === "20"}
          label="20 Days"
        />
        <RadioButton
          name="inspection-period-20"
          onChange={() => {
            setValue("30");
            onChange(30);
            setShowInput(false);
          }}
          checked={!showInput && value === "30"}
          label="30 Days"
        />
        <RadioButton
          name="inspection-period-other"
          onChange={() => {
            setShowInput(true);
          }}
          checked={showInput}
          label="Other"
        />
        {showInput && (
          <TextField
            value={value || ""}
            placeholder="Type here"
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

export default OfferInspectionPeriodField;
