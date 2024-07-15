import routes from "@/helpers/routes";
import { getLendDetailsAction } from "@/server-actions/marketplace/action";
import { redirect } from "next/navigation";
import { getUserAction } from "@/server-actions/user/actions";
import LandDetails from "./land-details";

const LandDetailsWrapper = async ({ landId }: { landId: string }) => {
  const { data } = await getLendDetailsAction(landId);
  const user = await getUserAction();

  if (!data) {
    redirect(routes.marketplace.fullUrl);
  }

  return (
    <div>
      <LandDetails data={data} user={user!} />
    </div>
  );
};

export default LandDetailsWrapper;
