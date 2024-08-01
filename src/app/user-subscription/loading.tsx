import MiniLayout from "@/components/@new/shared/mini-layout";
import SubscriptionLoading from "@/components/@new/subscription/subscription-loading";

const UserSubscriptionLoading = () => (
  <MiniLayout rootClasses="min-h-screen">
    <div className="rounded-2xl lg:bg-white lg:p-12 xl:p-16">
      <SubscriptionLoading />
    </div>
  </MiniLayout>
);

export default UserSubscriptionLoading;
