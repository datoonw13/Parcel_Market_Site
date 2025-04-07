import { getUserAction } from "@/server-actions/user/actions";
import Link from "next/link";
import routes from "@/helpers/routes";
import { IUserBaseInfo } from "@/types/auth";
import Alert from "./Alert";

const SubscriptionAlert = ({ user }: { user: IUserBaseInfo | null }) =>
  !user?.isSubscribed && (
    <Alert
      className="mb-6 md:mb-8"
      type="warning"
      title={user?.planSelected && !user.isSubscribed ? "Your Subscription has been Expired" : "You have no subscription"}
      description={
        <span>
          If you want to activate new plan click on{" "}
          <Link href={routes.user.subscription.fullUrl}>
            <span className="cursor-pointer underline">Choose Plan button</span>
          </Link>
          , or check the information on your profile section
        </span>
      }
    />
  );

export default SubscriptionAlert;
