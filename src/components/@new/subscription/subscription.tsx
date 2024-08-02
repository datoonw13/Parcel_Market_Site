import { Suspense } from "react";
import SubscriptionHeader from "./subscription-header";
import PlanList from "./plans/plan-list";
import PlanListLoading from "./plans/subscription-loading";

const Subscription = () => (
  <>
    <div className="space-y-6 sm:space-y-8 md:space-y-12 lg:space-y-16">
      <SubscriptionHeader />
      <div className="space-y-6">
        <h2 className="hidden sm:block text-center text-lg font-semibold">How Would You like to Pay?</h2>
        <Suspense fallback={<PlanListLoading />}>
          <PlanList />
        </Suspense>
      </div>
    </div>
  </>
);

export default Subscription;
