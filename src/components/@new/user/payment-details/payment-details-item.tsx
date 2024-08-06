"use client";

import { FC } from "react";
import clsx from "clsx";
import { LoadingIcon1 } from "../../icons/LoadingIcons";

interface PaymentDetailsItemProps {
  title: string;
  description?: string;
  buttonLabel: string;
  onClick: () => void;
  pending?: boolean;
  buttonClassName?: string;
}

const PaymentDetailsItem: FC<PaymentDetailsItemProps> = ({ title, description, buttonLabel, onClick, pending, buttonClassName }) => (
  <div className="w-full flex justify-between items-center">
    <div className="flex flex-col gap-1">
      <p className="font-medium text-sm">{title}</p>
      {description && <p className="font-medium text-xs text-grey-600">{description}</p>}
    </div>
    <button
      disabled={pending}
      type="button"
      className={clsx("font-medium text-xs text-primary-main flex items-center gap-3 relative cursor-pointer", buttonClassName)}
      onClick={onClick}
    >
      <div className={clsx(pending && "opacity-0")}>{buttonLabel}</div>
      {pending && <LoadingIcon1 color="primary-main" className="!w-4 !h-4 absolute left-[50%] translate-x-[-50%]" />}
    </button>
  </div>
);

export default PaymentDetailsItem;
