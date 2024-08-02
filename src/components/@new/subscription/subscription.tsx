"use client";

import { useState } from "react";
import { ISubscription, SubscriptionType, IStripeStatuses } from "@/types/subscriptions";
import { useRouter } from "next/navigation";
import routes from "@/helpers/routes";
import clsx from "clsx";
import { ISignInResponse } from "@/types/auth";
import PlanBox from "./plan-box";
import UpdatePlanDialog from "./update-plan-dialog";
import CancelPlanDialog from "./cancel-plan-dialog";
import SubscriptionHeader from "./subscription-header";

const Subscription = ({ userSubscriptions, user }: { userSubscriptions: ISubscription[] | null; user: ISignInResponse["payload"] }) => {
  const router = useRouter();
  const userActiveSubscription = userSubscriptions?.find((el) => el.status === "active" || el.status === "trialing");
  const [upgradeSubscriptionTo, setUpgradeSubscriptionTo] = useState<SubscriptionType | null>(null);
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const isActive = (subscription: SubscriptionType) => {
    if (subscription === SubscriptionType.Trial) {
      return userActiveSubscription?.status === "trialing";
    }
    if (subscription === SubscriptionType.Monthly && userActiveSubscription?.status !== "trialing") {
      return userActiveSubscription?.type === SubscriptionType.Monthly;
    }

    return userActiveSubscription?.type === SubscriptionType.Annual;
  };

  const handleSubscriptionUpgrade = () => {
    router.push(`${routes.checkout.fullUrl}?plan=${upgradeSubscriptionTo}`);
  };

  return (
    <>
      {upgradeSubscriptionTo && (
        <UpdatePlanDialog
          closeDialog={() => setUpgradeSubscriptionTo(null)}
          onSubmit={handleSubscriptionUpgrade}
          pending={false}
          subscription={upgradeSubscriptionTo}
        />
      )}
      {openCancelModal && userActiveSubscription && (
        <CancelPlanDialog closeDialog={() => setOpenCancelModal(false)} userActiveSubscription={userActiveSubscription} />
      )}
      <div className="space-y-6 sm:space-y-8 md:space-y-12 lg:space-y-16">
        <SubscriptionHeader />
        <div className="space-y-6">
          <h2 className="hidden sm:block text-center text-lg font-semibold">How Would You like to Pay?</h2>
          <div className={clsx("grid gap-4 grid-cols-1 sm:grid-cols-2", !user.planSelected && "lg:grid-cols-3")}>
            {!user.planSelected && (
              <PlanBox
                title="14 Days"
                price="Free"
                period="14 Days"
                periodDesc="(No card needed)"
                onChange={() =>
                  isActive(SubscriptionType.Trial) ? setOpenCancelModal(true) : setUpgradeSubscriptionTo(SubscriptionType.Trial)
                }
                selected={isActive(SubscriptionType.Trial)}
                activeUntil={isActive(SubscriptionType.Trial) ? userActiveSubscription?.activeTo : undefined}
              />
            )}
            <PlanBox
              title="Monthly"
              price="$20.00"
              period="Per Month"
              selected={isActive(SubscriptionType.Monthly)}
              activeUntil={isActive(SubscriptionType.Monthly) ? userActiveSubscription?.activeTo : undefined}
              onChange={() =>
                isActive(SubscriptionType.Monthly) ? setOpenCancelModal(true) : setUpgradeSubscriptionTo(SubscriptionType.Monthly)
              }
            />
            <PlanBox
              title="Annual"
              price="215.00"
              period="Per Year"
              periodDesc="(Save 10% per month)"
              onChange={() =>
                isActive(SubscriptionType.Annual) ? setOpenCancelModal(true) : setUpgradeSubscriptionTo(SubscriptionType.Annual)
              }
              selected={isActive(SubscriptionType.Annual)}
              activeUntil={isActive(SubscriptionType.Trial) ? userActiveSubscription?.activeTo : undefined}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscription;
