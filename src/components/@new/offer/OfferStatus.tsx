import React from "react";
import clsx from "clsx";
import { RemoveIcon2 } from "../icons/RemoveIcons";
import { ClockIcon1, ClockIcon2 } from "../icons/ClockIcons";
import { CheckIcon3 } from "../icons/CheckIcons";

const options = {
  pending: {
    color: "warning",
    icon: <ClockIcon1 className="!w-3 !h-3" color="white" />,
  },
  expired: {
    color: "info",
    icon: <ClockIcon2 className="!w-3 !h-3" color="white" />,
  },
  accepted: {
    color: "success",
    icon: <CheckIcon3 className="!w-3" color="white" />,
  },
  declined: {
    color: "error",
    icon: <RemoveIcon2 className="!w-2 !h-2" color="white" />,
  },
};

const OfferStatus = ({ status }: { status: keyof typeof options }) => (
  <div className="flex flex-row items-center gap-1">
    <div className={clsx("w-5 h-5 rounded-full flex items-center justify-center", `bg-${options[status].color}`)}>
      {options[status].icon}
    </div>
    <p className="text-xs text-grey-600">
      Status:<span className="text-black font-semibold ml-1 capitalize">{status}</span>
    </p>
  </div>
);

export default OfferStatus;
