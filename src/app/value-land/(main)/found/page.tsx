import ValueLandFound from "@/components/@new/value-land/value-land-found";
import { getUserAction } from "@/server-actions/user/actions";

const ValueLandFoundPage = async () => {
  const user = await getUserAction();
  return <ValueLandFound user={user} />;
};

export default ValueLandFoundPage;
