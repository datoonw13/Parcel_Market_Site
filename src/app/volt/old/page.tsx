import VoltWrapper from "@/components/volt/volt-wrapper";
import { getUserAction } from "@/server-actions/user/actions";

export const maxDuration = 800;

const VoltPage = async () => {
  const user = await getUserAction();
  return <VoltWrapper user={user} />;
};

export default VoltPage;
