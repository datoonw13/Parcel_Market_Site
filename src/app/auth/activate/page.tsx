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

  return <AccountActivation email={searchParams.email} errorMessage={errorMessage} />;
};

export default AccountActivationPage;
