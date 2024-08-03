"use client";

import React, { FC, useState } from "react";
import moment from "moment";
import clsx from "clsx";
import { ISubscription, SubscriptionType } from "@/types/subscriptions";
import { useRouter } from "next/navigation";
import routes from "@/helpers/routes";
import { CheckIcon3 } from "../../icons/CheckIcons";
import Button from "../../shared/forms/Button";
import UpdatePlanDialog from "./update-plan-dialog";
import CancelPlanDialog from "./cancel-plan-dialog";

interface PlanItemProps {
  className?: string;
  userActiveSubscription: ISubscription | undefined;
  type: SubscriptionType;
}

const subscriptionDetail = (subscription: SubscriptionType) => {
  switch (subscription) {
    case SubscriptionType.Monthly:
      return {
        title: "Monthly",
        price: "$20.00",
        period: "Per Month",
      };
    case SubscriptionType.Annual:
      return {
        title: "Annual",
        price: "$215.00",
        period: "Per Year",
        periodDesc: "(Save 10% per month)",
      };
    default:
      return {
        title: "14 Days",
        price: "Free",
        period: "14 Days",
      };
  }
};

const checkIsActive = (subscription: SubscriptionType, userActiveSubscription?: ISubscription) => {
  if (subscription === SubscriptionType.Trial) {
    return userActiveSubscription?.status === "trialing";
  }
  if (subscription === SubscriptionType.Monthly && userActiveSubscription?.status !== "trialing") {
    return userActiveSubscription?.type === SubscriptionType.Monthly;
  }

  return userActiveSubscription?.type === SubscriptionType.Annual;
};

const PlanItem: FC<PlanItemProps> = ({ className, userActiveSubscription, type }) => {
  const router = useRouter();

  const { period, price, title, periodDesc } = subscriptionDetail(type);
  const isActive = checkIsActive(type, userActiveSubscription);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);

  return (
    <>
      {openUpgradeModal && (
        <UpdatePlanDialog
          closeDialog={() => setOpenUpgradeModal(false)}
          onSubmit={() => {
            router.push(`${routes.checkout.fullUrl}?plan=${type}`);
          }}
          pending={false}
          subscription={type}
        />
      )}
      {openCancelModal && userActiveSubscription && (
        <CancelPlanDialog closeDialog={() => setOpenCancelModal(false)} userActiveSubscription={userActiveSubscription} />
      )}
      <div
        className={clsx(
          "space-y-8 p-4 md:p-6 lg:8 border border-grey-100 rounded-2xl justify-between flex flex-col",
          className,
          isActive && "border-primary-main"
        )}
      >
        <div className="space-y-4 ">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-primary-main text-lg font-semibold min-w-max">{title}</h2>
              <div className="w-4 h-4 rounded-full bg-primary-main p-1">
                <CheckIcon3 color="white" className="!w-2.5 !h-2" />
              </div>
            </div>
            {isActive && (
              <p className="text-end text-sm text-grey-600 font-medium">
                Active Until {moment(userActiveSubscription!.activeTo).format("DD/MM/YYYY")}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">
              {price}
              {periodDesc && <span className="text-xs font-medium text-grey-800">{periodDesc}</span>}
            </h3>
            <p className="font-medium text-sm">
              <span className="text-primary-main text-sm font-medium">{period}</span> {periodDesc}
            </p>
          </div>
        </div>
        <Button
          onClick={isActive ? () => setOpenCancelModal(true) : () => setOpenUpgradeModal(true)}
          className="w-full"
          variant={isActive ? "secondary" : "primary"}
        >
          {isActive ? "Cancel Subscription" : "Subscribe"}
        </Button>
      </div>
    </>
  );
};

export default PlanItem;
