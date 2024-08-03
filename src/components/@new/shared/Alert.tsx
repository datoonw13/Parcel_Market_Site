"use client";

import { FC, useState } from "react";
import { twMerge } from "tailwind-merge";
import { InfoIcon2 } from "../icons/InfoIcons";
import { RemoveIcon2 } from "../icons/RemoveIcons";
import Button from "./forms/Button";

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
  onClose?: () => void;
  type?: AlertType;
  disableClose?: boolean;
  className?: string;
};

const Alert: FC<AlertProps> = ({ type = "success", description, onClose, title, disableClose, className }) => {
  const [show, setShow] = useState(true);
  return show ? (
    <div className={twMerge("flex w-full px-4 py-3 rounded-lg", `bg-${colors[type].bg}`, className)}>
      <InfoIcon2 color={colors[type].icon} className="min-w-5 min-h-5 !w-5 !h-5 mr-3 translate-y-1" />
      <div>
        <p className="font-semibold text-sm ">{title}</p>
        <p className="text-xs text-grey-800">{description} </p>
      </div>
      {!disableClose && (
        <div
          onClick={() => {
            setShow(false);
            onClose && onClose();
          }}
          className="ml-auto  cursor-pointer translate-y-1"
        >
          <Button variant="secondary" className="!p-0 !outline-none !w-6 !h-6">
            <RemoveIcon2 className="!w-3 !h-3" color="grey-600" />
          </Button>
        </div>
      )}
    </div>
  ) : null;
};

export default Alert;
