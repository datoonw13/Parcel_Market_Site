import PlanListWrapper from "@/components/@new/subscription/plans/plan-list-wrapper";
import UserProfileSectionHeader from "@/components/@new/user/UserSectionHeading";
import PaymentDetails from "@/components/@new/user/payment-details/payment-details";

const UserProfileSubscription = async () => (
  <div className="w-full space-y-8">
    <div className="flex justify-between flex-col sm:flex-row gap-6">
      <UserProfileSectionHeader title="Subscription" description="Manage your subscriptions and payments" />
    </div>
    <PlanListWrapper className="sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 sxl:grid-cols-2" />
    <PaymentDetails />
  </div>
);
export default UserProfileSubscription;
