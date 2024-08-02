import MiniLayout from "@/components/@new/shared/mini-layout";
import Subscription from "@/components/@new/subscription/subscription";
import { getUserSubscriptions } from "@/server-actions/subscription/actions";

const UserSubscriptionPage = async () => {
  const userSubscriptions = await getUserSubscriptions();

  return (
    <MiniLayout rootClasses="min-h-screen">
      <div className="rounded-2xl lg:bg-white lg:p-12 xl:p-16">
        <Subscription userSubscriptions={userSubscriptions.data} />
      </div>
    </MiniLayout>
  );
};

export default UserSubscriptionPage;
