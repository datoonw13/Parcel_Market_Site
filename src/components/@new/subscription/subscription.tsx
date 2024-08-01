"use client";

import { useState } from "react";
import { ISubscription, SubscriptionType } from "@/types/subscriptions";
import { useRouter } from "next/navigation";
import routes from "@/helpers/routes";
import { cancelSubscriptionAction } from "@/server-actions/subscription/actions";
import { CheckIcon4 } from "../icons/CheckIcons";
import PlanBox from "./plan-box";
import UpdatePlanDialog from "./update-plan-dialog";
import CancelPlanDialog from "./cancel-plan-dialog";
import SubscriptionHeader from "./subscription-header";

const Subscription = ({ data }: { data: ISubscription[] | null }) => {
  const router = useRouter();
  const userActiveSubscription = data?.find((el) => el.status === "active");
  const [upgradeSubscriptionTo, setUpgradeSubscriptionTo] = useState<SubscriptionType | null>(null);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [cancelPending, setCancelPending] = useState(false);

  const isActive = (subscription: SubscriptionType) => subscription === userActiveSubscription?.type;

  const handleSubscriptionUpgrade = () => {
    router.push(`${routes.checkout.fullUrl}?plan=${upgradeSubscriptionTo}`);
  };

  const cancelSubscription = async (subscriptionId: string) => {
    setCancelPending(true);
    await cancelSubscriptionAction(subscriptionId);
    setCancelPending(false);
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
      <CancelPlanDialog
        closeDialog={() => setOpenCancelModal(false)}
        open={openCancelModal}
        onSubmit={() => setOpenCancelModal(false)}
        pending={false}
        selectReason={() => {}}
        selectedReason={null}
      />
      <div className="space-y-6 sm:space-y-8 md:space-y-12 lg:space-y-16">
        <SubscriptionHeader />
        <div className="space-y-6">
          <h2 className="hidden sm:block text-center text-lg font-semibold">How Would You like to Pay?</h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <PlanBox
              title="14 Days"
              price="Free"
              period="14 Days"
              periodDesc="(No card needed)"
              onChange={() =>
                isActive(SubscriptionType.Trial)
                  ? cancelSubscription(SubscriptionType.Trial)
                  : setUpgradeSubscriptionTo(SubscriptionType.Trial)
              }
              selected={isActive(SubscriptionType.Trial)}
              activeUntil={isActive(SubscriptionType.Trial) ? userActiveSubscription?.activeTo : undefined}
              pending={cancelPending}
            />
            <PlanBox
              title="Monthly"
              price="$20.00"
              period="Per Month"
              selected={isActive(SubscriptionType.Monthly)}
              activeUntil={isActive(SubscriptionType.Monthly) ? userActiveSubscription?.activeTo : undefined}
              onChange={() =>
                isActive(SubscriptionType.Monthly)
                  ? cancelSubscription(SubscriptionType.Monthly)
                  : setUpgradeSubscriptionTo(SubscriptionType.Monthly)
              }
              pending={cancelPending}
            />
            <PlanBox
              title="Annual"
              price="215.00"
              period="Per Year"
              periodDesc="(Save 10% per month)"
              onChange={() =>
                isActive(SubscriptionType.Annual)
                  ? cancelSubscription(SubscriptionType.Annual)
                  : setUpgradeSubscriptionTo(SubscriptionType.Annual)
              }
              selected={isActive(SubscriptionType.Annual)}
              activeUntil={isActive(SubscriptionType.Trial) ? userActiveSubscription?.activeTo : undefined}
              pending={cancelPending}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscription;
