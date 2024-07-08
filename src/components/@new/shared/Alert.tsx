import React, { FC } from "react";
import clsx from "clsx";
import { InfoIcon1, InfoIcon2 } from "../icons/InfoIcons";
import { RemoveIcon2 } from "../icons/RemoveIcons";

type AlertType = "success" | "warning";

const colors = {
  success: {
    icon: "primary-main",
    bg: "primary-main-100",
  },
  warning: {
    icon: "warning",
    bg: "warning-100",
  },
};

type AlertProps = {
  title: string;
  description: string;
  onClose: () => void;
  type?: AlertType;
};

const Alert: FC<AlertProps> = ({ type = "success", description, onClose, title }) => (
  <div className={clsx("flex w-full px-4 py-3 rounded-lg", `bg-${colors[type].bg}`)}>
    <InfoIcon2 color={colors[type].icon} className="w-5 h-5 mr-3 translate-y-1" />
    <div>
      <p className="font-semibold text-sm">{title}</p>
      <p className="text-xs text-grey-800">{description} </p>
    </div>
    {onClose && (
      <div onClick={onClose} className="ml-auto  cursor-pointer translate-y-1">
        <RemoveIcon2 className="w-3 h-3" color="grey-600" />
      </div>
    )}
  </div>
);

export default Alert;
