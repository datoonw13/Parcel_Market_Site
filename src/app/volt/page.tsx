import VoltLayout from "@/components/volt-new/layout";
import { getUserAction } from "@/server-actions/user/actions";
import { getPropertiesAction } from "@/server-actions/volt/actions";
import { voltSearchSchema } from "@/zod-validations/volt";

export const maxDuration = 60;
const Volt = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  const validateParams = await voltSearchSchema.safeParseAsync(searchParams);
  const data = validateParams.success ? await getPropertiesAction(validateParams.data) : null;
  const user = await getUserAction();

  return <VoltLayout user={user} data={data} initialParams={validateParams.data || null} />;
};

export default Volt;
