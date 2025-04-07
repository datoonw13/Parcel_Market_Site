import routes from "@/helpers/routes";
import { activateUserAccountAction } from "@/server-actions/user/actions";
import { redirect } from "next/navigation";
import AccountActivation from "./account-activation";

const AccountActivationPage = async ({ searchParams }: { searchParams: { token?: string; email?: string; redirectUrl?: string } }) => {
  if (!searchParams.email || !searchParams.token || !searchParams.redirectUrl) {
    redirect(routes.auth.signIn.fullUrl);
  }
  const { errorMessage, data } = await activateUserAccountAction(searchParams.token);

  if (data) {
    const params = new URLSearchParams();
    params.set("jwt", data.access_token);
    params.set("jwtRefresh", data.refresh_token);
    params.set("redirectUrl", searchParams.redirectUrl);
    redirect(`${routes.auth.signUp.success.fullUrl}?${params.toString()}`);
  }

  return errorMessage && <AccountActivation email={searchParams.email} />;
};

export default AccountActivationPage;
