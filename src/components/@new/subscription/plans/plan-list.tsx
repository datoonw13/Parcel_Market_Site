import clsx from "clsx";
import { getUserSubscriptions } from "@/server-actions/subscription/actions";
import { SubscriptionType } from "@/types/subscriptions";
import { getUserAction } from "@/server-actions/user/actions";
import PlanItem from "./plan-item";

const PlanList = async () => {
  const user = await getUserAction();
  const userSubscriptions = await getUserSubscriptions();
  const userActiveSubscription = userSubscriptions.data?.find((el) => el.status === "active" || el.status === "trialing");

  const showPlan = (plan: SubscriptionType) => {
    // if (plan !== SubscriptionType.Trial) {
    //   return true;
    // }

    if (!user?.planSelected) {
      return true;
    }
    if (user.planSelected && userActiveSubscription?.status === "trialing") {
      return true;
    }
    return false;
  };

  return (
    <div className={clsx("grid gap-4 grid-cols-1 sm:grid-cols-2")}>
      {Object.keys(SubscriptionType).map(
        (type) =>
          showPlan(type as any) && <PlanItem key={type} type={type as SubscriptionType} userActiveSubscription={userActiveSubscription} />
      )}
    </div>
  );
};

export default PlanList;
