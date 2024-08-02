import clsx from "clsx";
import React from "react";
import { getUserSubscriptions } from "@/server-actions/subscription/actions";
import { SubscriptionType } from "@/types/subscriptions";
import PlanItem from "./plan-item";

const PlanList = async () => {
  const userSubscriptions = await getUserSubscriptions();
  const userActiveSubscription = userSubscriptions.data?.find((el) => el.status === "active" || el.status === "trialing");

  return (
    <div className={clsx("grid gap-4 grid-cols-1 sm:grid-cols-2", !false && "lg:grid-cols-3")}>
      {Object.keys(SubscriptionType).map((type) => (
        <PlanItem key={type} type={type as SubscriptionType} userActiveSubscription={userActiveSubscription} />
      ))}
    </div>
  );
};

export default PlanList;
