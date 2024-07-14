"use client";

import { FC } from "react";
import { twMerge } from "tailwind-merge";
import { InfoIcon2 } from "../icons/InfoIcons";
import { RemoveIcon2 } from "../icons/RemoveIcons";

type AlertType = "success" | "warning" | "info";

const colors = {
  success: {
    icon: "primary-main",
    bg: "primary-main-100",
  },
  warning: {
    icon: "warning",
    bg: "warning-100",
  },
  info: {
    icon: "info",
    bg: "info-100",
  },
};

type AlertProps = {
  title: string;
  description: string;
  onClose: () => void;
  type?: AlertType;
};

const Alert: FC<AlertProps> = ({ type = "success", description, onClose, title }) => (
  <div className={twMerge("flex w-full px-4 py-3 rounded-lg", `bg-${colors[type].bg}`)}>
    <InfoIcon2 color={colors[type].icon} className="min-w-5 min-h-5 !w-5 !h-5 mr-3 translate-y-1 z-[-1]" />
    <div>
      <p className="font-semibold text-sm ">{title}</p>
      <p className="text-xs text-grey-800">{description} </p>
    </div>
    {onClose && (
      <div onClick={onClose} className="ml-auto  cursor-pointer translate-y-1 z-[-1]">
        <RemoveIcon2 className="!w-3 !h-3 z-[-1]" color="grey-600" />
      </div>
    )}
  </div>
);

export default Alert;
