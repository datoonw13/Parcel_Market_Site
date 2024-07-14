import TextField from "@/components/@new/shared/forms/TextField";
import LabelWithInfo from "@/components/@new/shared/label-with-info";
import React, { FC, useState } from "react";

interface OfferPriceFieldProps {
  error?: boolean;
  onChange: (value: number) => void;
}

const OfferPriceField: FC<OfferPriceFieldProps> = ({ onChange, error }) => {
  const [value, setValue] = useState("");
  return (
    <div className="flex flex-col gap-3">
      <LabelWithInfo error={!!error} label="Offer Price" description="" />
      <TextField
        onChange={(price) => {
          setValue(price);
          onChange(Number(price));
        }}
        placeholder="Offer Price"
        type="number"
        value={value}
      />
    </div>
  );
};

export default OfferPriceField;
