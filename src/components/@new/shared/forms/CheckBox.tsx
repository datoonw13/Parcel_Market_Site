import React, { ChangeEvent, FC } from "react";
import { CheckIcon1, CheckIcon2 } from "../../icons/CheckIcons";

interface CheckBoxProps {
  name?: string;
  checked?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
}

const CheckBox: FC<CheckBoxProps> = ({ name, checked, onChange, label }) => (
  <label className="text-xs font-medium flex items-center gap-2 select-none text-grey-800">
    <input checked={checked} className="peer relative appearance-none w-4 h-4 hidden" type="checkbox" name={name} onChange={onChange} />
    <CheckIcon1 className="block peer-checked:hidden" />
    <CheckIcon2 className="hidden peer-checked:block" />
    {label}
  </label>
);

export default CheckBox;
