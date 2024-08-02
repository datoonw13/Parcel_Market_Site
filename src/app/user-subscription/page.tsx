import MiniLayout from "@/components/@new/shared/mini-layout";
import Subscription from "@/components/@new/subscription/subscription";
import { getUserSubscriptions } from "@/server-actions/subscription/actions";
import { getUserAction } from "@/server-actions/user/actions";

const UserSubscriptionPage = async () => {
  const userSubscriptions = await getUserSubscriptions();
  const user = await getUserAction();

  return (
    <MiniLayout rootClasses="min-h-screen">
      <div className="rounded-2xl lg:bg-white lg:p-12 xl:p-16">
        <Subscription userSubscriptions={userSubscriptions.data} user={user!} />
      </div>
    </MiniLayout>
  );
};

export default UserSubscriptionPage;
