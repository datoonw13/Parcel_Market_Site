"use client";

import RadioButton from "@/components/@new/shared/forms/RadioButton";
import TextField from "@/components/@new/shared/forms/TextField";
import LabelWithInfo from "@/components/@new/shared/label-with-info";
import React, { FC, useState } from "react";

interface OfferInspectionPeriodFieldProps {
  error?: boolean;
  onChange: (value: number | undefined) => void;
}

const OfferInspectionPeriodField: FC<OfferInspectionPeriodFieldProps> = ({ onChange, error }) => {
  const [showInput, setShowInput] = useState(false);
  const [value, setValue] = useState("");
  return (
    <div className="flex flex-col gap-3" onBlur={() => onChange(value ? Number(value) : undefined)}>
      <LabelWithInfo
        error={!!error}
        label="Inspection Period"
        description="The amount of time you need to inspect the property and receive a full refund on your deposit should you not move forward with the sale."
      />
      <div className="flex flex-col gap-4">
        <RadioButton
          name="inspection-period-none"
          onChange={() => {
            setValue("");
            setShowInput(false);
          }}
          checked={!showInput && !value}
          label="None"
        />
        <RadioButton
          name="inspection-period-5"
          onChange={() => {
            setValue("10");
            setShowInput(false);
          }}
          checked={!showInput && value === "10"}
          label="10 Days"
        />
        <RadioButton
          name="inspection-period-10"
          onChange={() => {
            setValue("20");
            setShowInput(false);
          }}
          checked={!showInput && value === "20"}
          label="20 Days"
        />
        <RadioButton
          name="inspection-period-20"
          onChange={() => {
            setValue("30");
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
        {showInput && <TextField value={value || ""} placeholder="Type here" onChange={(value) => setValue(value)} />}
      </div>
    </div>
  );
};

export default OfferInspectionPeriodField;