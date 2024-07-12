"use client";

import RadioButton from "@/components/@new/shared/forms/RadioButton";
import LabelWithInfo from "@/components/@new/shared/label-with-info";
import { FC } from "react";

interface OfferClosingPeriodFieldProps {
  error?: boolean;
  value: number;
  onChange: (value: number) => void;
}

const OfferClosingPeriodField: FC<OfferClosingPeriodFieldProps> = ({ onChange, value, error }) => (
  <div className="flex flex-col gap-3">
    <LabelWithInfo
      label="Closing Period"
      description="The amount of time you need to close on the land. This includes the time for the inspection period, if any."
      error={!!error}
    />
    <div className="flex flex-col gap-4">
      <RadioButton name="closing-period-15" onChange={() => onChange(15)} checked={value === 15} label="15 Days" />
      <RadioButton name="closing-period-30" onChange={() => onChange(30)} checked={value === 30} label="30 Days" />
      <RadioButton name="closing-period-45" onChange={() => onChange(45)} checked={value === 45} label="45 Days" />
    </div>
  </div>
);

export default OfferClosingPeriodField;
