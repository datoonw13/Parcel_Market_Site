import { Suspense } from "react";
import PlanListLoading from "./subscription-loading";
import PlanList from "./plan-list";

const PlanListWrapper = ({ className }: { className?: string }) => (
  <Suspense fallback={<PlanListLoading />}>
    <PlanList className={className} />
  </Suspense>
);

export default PlanListWrapper;
