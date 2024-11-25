"use client";

import React, { FC, useState } from "react";
import moment from "moment";
import { ISubscription, SubscriptionType } from "@/types/subscriptions";
import { useRouter, useSearchParams } from "next/navigation";
import routes from "@/helpers/routes";
import { resumeSubscriptionAction } from "@/server-actions/subscription/actions";
import { FaArrowRightLong } from "react-icons/fa6";
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
        desc: "per month",
      };
    case SubscriptionType.Annual:
      return {
        title: "Annual",
        price: "$215.00",
        desc: "save 10% per month",
      };
    default:
      return {
        title: "5 Days",
        price: "Free",
        desc: "Risk Free! No Payment Info Required",
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
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams as any);

  const { price, title, desc } = subscriptionDetail(type);
  const isActive = checkIsActive(type, userActiveSubscription);
  // const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [resumePending, setResumePending] = useState(false);

  return (
    <>
      {/* {openUpgradeModal && (
        <UpdatePlanDialog
          closeDialog={() => setOpenUpgradeModal(false)}
          onSubmit={() => {
            params.set("plan", type);
            router.push(`${routes.checkout.fullUrl}?${params.toString()}`);
          }}
          pending={false}
          subscription={type}
        />
      )} */}
      {openCancelModal && userActiveSubscription && (
        <CancelPlanDialog closeDialog={() => setOpenCancelModal(false)} userActiveSubscription={userActiveSubscription} />
      )}
      <div className="bg-white rounded-2xl p-8 shadow-4 flex flex-col">
        <div className="gap-3 font-semibold text-sm text-primary-main min-h-14 flex items-start">
          {isActive ? (
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-success" />{" "}
              <span className="uppercase">active until: {moment(userActiveSubscription!.activeTo).format("MM/DD/YYYY")}</span>{" "}
            </div>
          ) : (
            <span className="uppercase text-sm"> {desc}</span>
          )}
        </div>
        <div className="flex items-baseline gap-1 mt-2 mb-8">
          <p className="text-5xl font-bold">{price}</p>
          <p>/ {title}</p>
        </div>
        {isActive && userActiveSubscription?.cancelAtPeriodEnd && (
          <Button
            onClick={async () => {
              setResumePending(true);
              const req = await resumeSubscriptionAction(userActiveSubscription.id);
              setResumePending(false);
              if (!req.errorMessage) {
                router.push(`${routes.user.subscription.fullUrl}?success=true`);
              }
            }}
            className="w-full mt-auto  font-semibold group-hover:text-white text-start justify-between"
            loading={resumePending}
            variant="primary"
          >
            Resume subscription
          </Button>
        )}
        {isActive && !userActiveSubscription?.cancelAtPeriodEnd && (
          <Button
            onClick={async () => {
              setOpenCancelModal(true);
            }}
            className="w-full mt-auto  font-semibold group-hover:text-white text-start justify-between"
            loading={resumePending}
            variant="secondary"
            endIcon={FaArrowRightLong}
          >
            Cancel subscription
          </Button>
        )}
        {!isActive && (
          <Button
            onClick={async () => {
              // setOpenUpgradeModal(true);
              params.set("plan", type);
              router.push(`${routes.checkout.fullUrl}?${params.toString()}`);
            }}
            className="w-full mt-auto  font-semibold group-hover:text-white text-start justify-between"
            loading={resumePending}
            variant="primary"
            endIcon={FaArrowRightLong}
          >
            {price === "Free" ? "Try for free" : "Subscribe"}
          </Button>
        )}
      </div>
    </>
  );
};

export default PlanItem;
