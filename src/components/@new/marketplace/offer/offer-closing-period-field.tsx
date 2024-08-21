"use client";

import RadioButton from "@/components/@new/shared/forms/RadioButton";
import LabelWithInfo from "@/components/@new/shared/label-with-info";
import { FC, useState } from "react";
import TextField from "../../shared/forms/text-field";

interface OfferClosingPeriodFieldProps {
  error?: boolean;
  onChange: (value: number) => void;
}

const OfferClosingPeriodField: FC<OfferClosingPeriodFieldProps> = ({ onChange, error }) => {
  const [showInput, setShowInput] = useState(false);
  const [value, setValue] = useState<string | null>("");
  return (
    <div className="flex flex-col gap-3">
      <LabelWithInfo
        label="Closing Period"
        description="The amount of time you need to close on the land. This includes the time for the inspection period, if any."
        error={!!error}
      />
      <div className="flex flex-col gap-4">
        <RadioButton
          name="closing-period-15"
          onChange={() => {
            setValue("15");
            onChange(15);
            setShowInput(false);
          }}
          checked={!showInput && value === "15"}
          label="15 Days"
        />
        <RadioButton
          name="closing-period-30"
          onChange={() => {
            setValue("30");
            onChange(30);
            setShowInput(false);
          }}
          checked={!showInput && value === "30"}
          label="30 Days"
        />
        <RadioButton
          name="closing-period-45"
          onChange={() => {
            setValue("45");
            onChange(45);
            setShowInput(false);
          }}
          checked={!showInput && value === "45"}
          label="45 Days"
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
            type="number"
            disableThousandsSeparator
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

export default OfferClosingPeriodField;
