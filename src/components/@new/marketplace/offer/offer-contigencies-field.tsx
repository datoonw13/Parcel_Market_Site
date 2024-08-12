"use client";

import React, { FC, useState } from "react";
import CheckBox from "@/components/@new/shared/forms/CheckBox";
import LabelWithInfo from "@/components/@new/shared/label-with-info";
import TextField from "@/components/@new/shared/forms/text-field";

interface OfferContingenciesFieldProps {
  error?: boolean;
  values: string[] | null;
  onChange: (value: string[] | null) => void;
}

const OfferContingenciesField: FC<OfferContingenciesFieldProps> = ({ onChange, values, error }) => {
  const [showInput, setShowInput] = useState(false);
  const otherValue = values?.filter((el) => el !== "Title" && el !== "Financing" && el !== "Appraisal")?.[0] || "";

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
          checked={values === null}
          label="None"
        />
        <CheckBox
          onChange={() => {
            if (!values) {
              onChange(["Title"]);
            } else if (values.includes("Title")) {
              const newValues = values.filter((el) => el !== "Title");
              onChange(newValues.length > 0 ? newValues : null);
            } else {
              const newValues = values || [];
              newValues.push("Title");
              onChange(newValues);
            }
          }}
          checked={!!values?.includes("Title")}
          label="Title"
        />
        <CheckBox
          onChange={() => {
            if (!values) {
              onChange(["Financing"]);
            } else if (values.includes("Financing")) {
              const newValues = values.filter((el) => el !== "Financing");
              onChange(newValues.length > 0 ? newValues : null);
            } else {
              const newValues = values || [];
              newValues.push("Financing");
              onChange(newValues);
            }
          }}
          checked={!!values?.includes("Financing")}
          label="Financing"
        />
        <CheckBox
          onChange={() => {
            if (!values) {
              onChange(["Appraisal"]);
            } else if (values.includes("Appraisal")) {
              const newValues = values.filter((el) => el !== "Appraisal");
              onChange(newValues.length > 0 ? newValues : null);
            } else {
              const newValues = values || [];
              newValues.push("Appraisal");
              onChange(newValues);
            }
          }}
          checked={!!values?.includes("Appraisal")}
          label="Appraisal"
        />
        <CheckBox
          onChange={() => {
            const show = !showInput;
            setShowInput(show);

            if (show) {
              const newValues = [...(values || []), ""];
              onChange(newValues);
            } else if (!show) {
              const newValues = values?.filter((el) => el !== otherValue);
              onChange(newValues && newValues?.length > 0 ? newValues : null);
            }
          }}
          checked={showInput}
          label="Other"
        />
        {showInput && (
          <TextField
            value={otherValue}
            onChange={(value) => {
              onChange([...(values?.filter((el) => el !== otherValue) || []), value]);
            }}
            placeholder="Type here"
          />
        )}
      </div>
    </div>
  );
};

export default OfferContingenciesField;
