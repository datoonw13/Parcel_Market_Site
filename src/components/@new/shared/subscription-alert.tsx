import { getUserAction } from "@/server-actions/user/actions";
import Link from "next/link";
import routes from "@/helpers/routes";
import Alert from "./Alert";

const SubscriptionAlert = async () => {
  const user = await getUserAction();
  return (
    !user?.isSubscribed && (
      <Alert
        className="mb-6 md:mb-8"
        type="warning"
        title={user?.planSelected && !user.isSubscribed ? "Your Subscription has been Expired" : "You have no subscription"}
        description={
          <span>
            If you want to activate new plan click on{" "}
            <Link href={routes.user.subscription.fullUrl}>
              <span className="cursor-pointer">Choose Plan button</span>
            </Link>
            , or check the information on your profile section
          </span>
        }
      />
    )
  );
};

export default SubscriptionAlert;
