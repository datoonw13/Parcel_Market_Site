import VoltLayout from "@/components/volt-new/layout";
import { getPropertiesAction } from "@/server-actions/volt/actions";
import { voltSearchSchema } from "@/zod-validations/volt";

const Volt = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  const validateParams = await voltSearchSchema.safeParseAsync(searchParams);
  const data = validateParams.success ? await getPropertiesAction(validateParams.data) : null;

  return <VoltLayout data={data} initialParams={validateParams.data || null} />;
};

export default Volt;
