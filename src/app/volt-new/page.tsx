import VoltLayout from "@/components/volt-new/layout";
import { getPropertiesAction } from "@/server-actions/volt/actions";
import { voltSearchSchema } from "@/zod-validations/volt";
import { Suspense } from "react";

const Volt = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  const validateParams = await voltSearchSchema.safeParseAsync(searchParams);
  const data = validateParams.success ? await getPropertiesAction(validateParams.data) : null;

  return (
    <Suspense>
      <VoltLayout data={data} />
    </Suspense>
  );
};

export default Volt;
