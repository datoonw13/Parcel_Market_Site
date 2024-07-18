"use client";

import React, { FC, useState } from "react";
import CheckBox from "@/components/@new/shared/forms/CheckBox";
import LabelWithInfo from "@/components/@new/shared/label-with-info";
import TextField from "@/components/@new/shared/forms/text-field";

interface OfferContingenciesFieldProps {
  error?: boolean;
  value: string | null;
  onChange: (value: string | null) => void;
}

const OfferContingenciesField: FC<OfferContingenciesFieldProps> = ({ onChange, value, error }) => {
  const [showInput, setShowInput] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <LabelWithInfo
        label="Contigencies"
        description="These are items the deal would be contingent on where buyer is due a full refund if not met."
        error={error}
      />
      <div className="flex flex-col gap-4">
        <CheckBox
          onChange={() => {
            setShowInput(false);
            onChange(null);
          }}
          checked={!showInput && value === null}
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
        <CheckBox
          onChange={() => {
            setShowInput(true);
            onChange("");
          }}
          checked={showInput}
          label="Other"
        />
        {showInput && <TextField value={value ?? ""} onChange={(value) => onChange(value)} placeholder="Type here" />}
      </div>
    </div>
  );
};

export default OfferContingenciesField;
