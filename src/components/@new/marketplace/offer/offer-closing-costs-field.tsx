"use client";

import RadioButton from "@/components/@new/shared/forms/RadioButton";
import LabelWithInfo from "@/components/@new/shared/label-with-info";
import React, { FC, useState } from "react";
import TextField from "@/components/@new/shared/forms/text-field";

interface OfferClosingCostsFieldProps {
  error?: boolean;
  value?: string;
  onChange: (value: string) => void;
}

const OfferClosingCostsField: FC<OfferClosingCostsFieldProps> = ({ onChange, value, error }) => {
  const [showInput, setShowInput] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <LabelWithInfo
        label="Closing Costs"
        error={error}
        description="All closing costs, including but not limited to attorney's fees (both parties), commissions, transfer fees, taxes, title fees, etc."
      />
      <div className="flex flex-col gap-4">
        <RadioButton
          name="closing-costs-seller"
          onChange={() => {
            onChange("Seller Pays");
            setShowInput(false);
          }}
          checked={!showInput && value === "Seller Pays"}
          label="Seller Pays"
        />
        <RadioButton
          name="closing-costs-split"
          onChange={() => {
            onChange("Split Equally");
            setShowInput(false);
          }}
          checked={!showInput && value === "Split Equally"}
          label="Split Equally"
        />
        <RadioButton
          name="closing-costs-buyer"
          onChange={() => {
            onChange("Buyer Pays");
            setShowInput(false);
          }}
          checked={!showInput && value === "Buyer Pays"}
          label="Buyer Pays"
        />
        <RadioButton name="closing-costs-other" onChange={() => setShowInput(true)} checked={showInput} label="Other" />
        {showInput && <TextField value={value ?? ""} onChange={(value) => onChange(value)} placeholder="Type here" />}
      </div>
    </div>
  );
};

export default OfferClosingCostsField;
