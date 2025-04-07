import { getUserSubscriptions } from "@/server-actions/subscription/actions";
import { SubscriptionType } from "@/types/subscriptions";
import { cn } from "@/lib/utils";
import PlanItem from "./plan-item";

const PlanList = async ({ className }: { className?: string }) => {
  const userSubscriptions = await getUserSubscriptions();
  const userActiveSubscription = userSubscriptions.data?.find((el) => el.status === "active" || el.status === "trialing");

  return (
    <div className={cn("grid gap-4 grid-cols-1 sm:grid-cols-2", className)}>
      {Object.keys(SubscriptionType).map((type) => (
        <PlanItem key={type} type={type as SubscriptionType} userActiveSubscription={userActiveSubscription} />
      ))}
    </div>
  );
};

export default PlanList;
