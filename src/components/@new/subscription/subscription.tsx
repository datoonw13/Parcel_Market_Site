"use client";

import { useState } from "react";
import { ISubscription, SubscriptionType } from "@/types/subscriptions";
import { useRouter } from "next/navigation";
import routes from "@/helpers/routes";
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
              onChange={() => setUpgradeSubscriptionTo(SubscriptionType.Trial)}
              selected={userActiveSubscription?.type === SubscriptionType.Trial}
            />
            <PlanBox
              title="Monthly"
              price="$20.00"
              period="Per Month"
              selected={userActiveSubscription?.type === SubscriptionType.Monthly}
              activeUntil={new Date()}
              onChange={() => setUpgradeSubscriptionTo(SubscriptionType.Monthly)}
            />
            <PlanBox
              title="Annual"
              price="215.00"
              period="Per Year"
              periodDesc="(Save 10% per month)"
              onChange={() => setUpgradeSubscriptionTo(SubscriptionType.Annual)}
              selected={userActiveSubscription?.type === SubscriptionType.Annual}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscription;
