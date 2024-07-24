"use client";

import React, { FC } from "react";
import moment from "moment";
import clsx from "clsx";
import { CheckIcon3 } from "../icons/CheckIcons";
import Button from "../shared/forms/Button";

interface PlanBoxProps {
  selected?: boolean;
  className?: string;
  title: string;
  activeUntil?: Date;
  price: string;
  priceDesc?: string;
  period: string;
  periodDesc?: string;
  onChange: () => void;
  pending?: boolean;
}
const PlanBox: FC<PlanBoxProps> = ({
  selected,
  className,
  activeUntil,
  period,
  price,
  title,
  periodDesc,
  priceDesc,
  onChange,
  pending,
}) => (
  <div className={clsx("space-y-8 p-4 md:p-6 lg:8 border border-grey-100 rounded-2xl", className, selected && "border-primary-main")}>
    <div className="space-y-4 ">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-primary-main text-lg md:text-xl lg:text-2xl font-semibold">{title}</h2>
          <div className="w-6 h-6 rounded-full bg-primary-main p-1">
            <CheckIcon3 color="white" />
          </div>
        </div>
        {selected && activeUntil && (
          <p className="text-sm text-grey-600 font-medium">Active Until {moment(activeUntil).format("DD/MM/YYYY")}</p>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-lg">
          {price}
          {priceDesc && <span className="text-xs font-medium text-grey-800">{priceDesc}</span>}
        </h3>
        <p className="font-medium text-sm">
          <span className="text-primary-main text-sm font-medium">{period}</span> {periodDesc}
        </p>
      </div>
    </div>
    <Button loading={pending} onClick={onChange} className="w-full" variant={selected ? "secondary" : "primary"}>
      {selected ? "Cancel Subscription" : "Subscribe"}
    </Button>
  </div>
);

export default PlanBox;
