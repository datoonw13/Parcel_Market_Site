import { getUserAction } from "@/server-actions/user/actions";
import Alert from "./Alert";

const SubscriptionAlert = async () => {
  const user = await getUserAction();
  return (
    !user?.isSubscribed && (
      <Alert
        className="mb-6 md:mb-8"
        type="warning"
        title={user?.planSelected && !user.isSubscribed ? "Your Subscription has been Expired" : "You have no subscription"}
        description="If you want to activate new plan click on Choose Plan button, or check the information on your profile section"
      />
    )
  );
};

export default SubscriptionAlert;
