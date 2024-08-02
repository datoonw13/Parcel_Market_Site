import MiniLayout from "@/components/@new/shared/mini-layout";
import Subscription from "@/components/@new/subscription/subscription";

const UserSubscriptionPage = async () => (
  <MiniLayout rootClasses="min-h-screen">
    <div className="rounded-2xl lg:bg-white lg:p-12 xl:p-16">
      <Subscription />
    </div>
  </MiniLayout>
);

export default UserSubscriptionPage;
