import routes from "@/helpers/routes";
import { getLendDetailsAction } from "@/server-actions/marketplace/action";
import { redirect } from "next/navigation";
import LandDetails from "./land-details";

const LandDetailsWrapper = async ({ landId }: { landId: string }) => {
  const { data } = await getLendDetailsAction(landId);

  if (!data) {
    redirect(routes.marketplace.fullUrl);
  }

  return (
    <div>
      <LandDetails data={data} />
    </div>
  );
};

export default LandDetailsWrapper;
