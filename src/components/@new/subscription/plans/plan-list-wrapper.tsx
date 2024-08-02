import { Suspense } from "react";
import PlanListLoading from "./subscription-loading";
import PlanList from "./plan-list";

const PlanListWrapper = () => (
  <Suspense fallback={<PlanListLoading />}>
    <PlanList />
  </Suspense>
);

export default PlanListWrapper;
