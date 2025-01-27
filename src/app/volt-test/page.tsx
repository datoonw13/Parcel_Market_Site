import VoltDesktopWrapper from "@/components/volt-test/desktop-wrapper";
import VoltSearchDetails from "@/components/volt-test/search-details";
import SearchAsyncWrapper from "@/components/volt-test/search-async-wrapper";
import { propertySearchTypeValidation } from "@/zod-validations/volt-new";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const VoltPage = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  const searchParamsObj = Object.fromEntries(new URLSearchParams(searchParams));
  const validationResult = await propertySearchTypeValidation.safeParseAsync(searchParamsObj);

  if (validationResult.error && Object.keys(searchParamsObj).length > 0) {
    return redirect(`/volt-test`);
  }

  if (validationResult.data?.entityName) {
    validationResult.data.firstName = validationResult.data?.entityName;
    delete validationResult.data.entityName;
  }

  const newKey = () => {
    const newData: any = validationResult.data && { ...validationResult.data };

    if (newData?.searchType) {
      delete newData.searchType;
    }

    return JSON.stringify(newData);
  };
  return (
    <VoltDesktopWrapper>
      <Suspense key={newKey()} fallback={<VoltSearchDetails isLoading searchParams={validationResult.data || null} />}>
        <SearchAsyncWrapper searchParams={validationResult.data || null} />
      </Suspense>
    </VoltDesktopWrapper>
  );
};

export default VoltPage;
