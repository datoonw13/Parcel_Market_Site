import AccountActivation from "@/components/@new/auth/account-activation";
import routes from "@/helpers/routes";
import { activateUserAccountAction } from "@/server-actions/user/actions";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

const AccountActivationPage = async ({ searchParams }: { searchParams: { token?: string; email?: string } }) => {
  if (!searchParams.email || !searchParams.token) {
    redirect(routes.auth.signIn.fullUrl);
  }
  const { errorMessage } = await activateUserAccountAction(searchParams.token);

  if (!errorMessage) {
    toast.success("Your email address has been successfully confirmed, now sign into your account", { duration: 3500 });
    redirect(routes.auth.signIn.fullUrl);
  }

  return <AccountActivation email={searchParams.email} />;
};

export default AccountActivationPage;
