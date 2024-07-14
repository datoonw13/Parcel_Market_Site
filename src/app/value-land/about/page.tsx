import ValueLandAbout from "@/components/@new/value-land/value-land-about";
import { getUserAction } from "@/server-actions/user/actions";

const ValueLandAboutPage = async () => {
  const user = await getUserAction();

  return <ValueLandAbout user={user} />;
};

export default ValueLandAboutPage;
