"use client";

import CheckBox from "@/components/@new/shared/forms/CheckBox";
import TextField from "@/components/@new/shared/forms/TextField";
import LabelWithInfo from "@/components/@new/shared/label-with-info";
import React, { FC, useState } from "react";

interface OfferContingenciesFieldProps {
  error?: boolean;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

const OfferContingenciesField: FC<OfferContingenciesFieldProps> = ({ onChange, value, error }) => {
  const [showInput, setShowInput] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <LabelWithInfo
        label="Contigencies"
        description="These are items the deal would be contingent on where buyer is due a full refund if not met."
      />
      <div className="flex flex-col gap-4">
        <CheckBox
          onChange={() => {
            setShowInput(false);
            onChange(undefined);
          }}
          checked={!showInput && !value}
          label="None"
        />
        <CheckBox
          onChange={() => {
            setShowInput(false);
            onChange("Title");
          }}
          checked={!showInput && value === "Title"}
          label="Title"
        />
        <CheckBox
          onChange={() => {
            setShowInput(false);
            onChange("Financing");
          }}
          checked={!showInput && value === "Financing"}
          label="Financing"
        />
        <CheckBox
          onChange={() => {
            setShowInput(false);
            onChange("Appraisal");
          }}
          checked={!showInput && value === "Appraisal"}
          label="Appraisal"
        />
        <CheckBox onChange={() => setShowInput(true)} checked={showInput} label="Other" />
        {showInput && <TextField value={value ?? ""} onChange={(value) => onChange(value)} placeholder="Type here" />}
      </div>
    </div>
  );
};

export default OfferContingenciesField;
