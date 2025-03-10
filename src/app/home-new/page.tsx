import HomeSectionsWrapper from "@/components/home-new/wrapper";
import { getUserSubscriptions } from "@/server-actions/subscription/actions";
import { getUserAction } from "@/server-actions/user/actions";
import { ISubscription, SubscriptionType } from "@/types/subscriptions";

const HomePage = async () => {
  const user = await getUserAction();
  const userSubscriptions = await getUserSubscriptions();
  let subscriptionType: ISubscription | null = null;

  if (userSubscriptions.data) {
    subscriptionType = userSubscriptions.data.find((el) => el.status === "active") || null;
  }
  return <HomeSectionsWrapper user={user} subscriptionType={subscriptionType} />;
};
export default HomePage;
