import { getUserAction } from "@/server-actions/user/actions";
import InvestingPageWrapper from "./wrapper";

const InvestingPage = async () => {
  const user = await getUserAction();
  return <InvestingPageWrapper user={user} />;
};

export default InvestingPage;
