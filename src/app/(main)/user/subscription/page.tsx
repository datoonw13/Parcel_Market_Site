import PlanListWrapper from "@/components/@new/subscription/plans/plan-list-wrapper";
import UserProfileSectionHeader from "@/components/@new/user/UserSectionHeading";
import PaymentDetails from "@/components/@new/user/payment-details/payment-details";

const UserProfileSubscription = async () => (
  <div className="w-full space-y-8">
    <div className="flex justify-between flex-col sm:flex-row gap-6">
      <UserProfileSectionHeader title="Subscription" description="Manage your subscriptions and payments" />
    </div>
    <PlanListWrapper />
    <PaymentDetails />
  </div>
);
export default UserProfileSubscription;
