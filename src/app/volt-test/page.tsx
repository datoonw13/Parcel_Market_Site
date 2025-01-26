import VoltDesktopWrapper from "@/components/volt-test/desktop-wrapper";
import VoltSearchDetails from "@/components/volt-test/search-details";
import SearchAsyncWrapper from "@/components/volt-test/search-async-wrapper";
import { propertySearchTypeValidation } from "@/zod-validations/volt-new";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const VoltPage = async ({ searchParams }: { [key: string]: string }) => {
  const searchParamsObj = Object.fromEntries(new URLSearchParams(searchParams));
  const validationResult = await propertySearchTypeValidation.safeParseAsync(searchParamsObj);

  if (validationResult.error && Object.keys(searchParamsObj).length > 0) {
    return redirect(`/volt-new`);
  }

  if (validationResult.data?.entityName) {
    validationResult.data.firstName = validationResult.data?.entityName;
    delete validationResult.data.entityName;
  }

  // const request = validationResult.error ? null : await getData(validationResult.data!);

  return (
    <VoltDesktopWrapper>
      <Suspense
        key={JSON.stringify(validationResult.data)}
        fallback={<VoltSearchDetails isLoading searchParams={validationResult.data || null} />}
      >
        <SearchAsyncWrapper searchParams={validationResult.data || null} />
      </Suspense>
    </VoltDesktopWrapper>
  );
};

export default VoltPage;
