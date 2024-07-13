"use client";

import React, { FC } from "react";
import clsx from "clsx";
import Popper from "./Popper";
import { InfoIcon1 } from "../icons/InfoIcons";
import Button from "./forms/Button";

interface LabelWithInfoProps {
  error?: boolean;
  label: string;
  description: string;
  labelClassName?: string;
  iconClassName?: string;
}

const LabelWithInfo: FC<LabelWithInfoProps> = ({ description, error, label, iconClassName, labelClassName }) => (
  <div className="flex gap-1">
    <p className={clsx("font-medium", error && "text-error", labelClassName)}>{label}</p>
    <Popper
      disableSameWidth
      renderButton={(setReferenceElement, referenceElement) => (
        <Button
          onMouseEnter={(e) => setReferenceElement(referenceElement ? null : e.currentTarget)}
          onMouseLeave={(e) => setReferenceElement(null)}
          variant="secondary"
          className="!outline-none !w-6 !h-6 !p-0"
        >
          <InfoIcon1 color="grey-600" className={clsx(iconClassName)} />
        </Button>
      )}
      renderContent={(setReferenceElement) => (
        <div className="bg-black rounded-md py-1.5 px-3 text-xss text-white max-w-60 text-center font-medium">{description}</div>
      )}
    />
  </div>
);

export default LabelWithInfo;
