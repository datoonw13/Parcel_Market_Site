"use client";

import WarningCircleIcon from "@/icons/WarningCircleIcon";
import { ReactNode } from "react";
import { Tooltip } from "react-tooltip";

type Props = Readonly<{
  label?: string;
  placeholder?: string;
  value?: string;
  info?: string;
  endIcon?: ReactNode;
}>;

const TextField = (props: Props) => {
  const { value, label, placeholder, info, endIcon } = props;
  return (
    <div>
      <div className="flex items-center mb-2 gap-2">
        {label && <p className="font-medium text-grey-500">{label}</p>}
        {info && (
          <>
            <div id="input-info" className="w-[16px]">
              <WarningCircleIcon />
            </div>
            <Tooltip anchorSelect="#input-info" content={info} className="!bg-white drop-shadow-lg rounded !text-dark-green-500" />
          </>
        )}
      </div>
      <div className="text-grey-500 border border-[#9CA3AF] px-4 py-3 focus-visible:outline-none rounded-lg w-full flex gap-4 bg-[#F3F4F6]">
        <input value={value || ""} placeholder={placeholder} className="text-grey-500 focus-visible:outline-none w-full bg-[#F3F4F6]" />
        {endIcon && endIcon}
      </div>
    </div>
  );
};
export default TextField;
