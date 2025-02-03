import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { z } from "zod";
import { fetcher } from "@/server-actions/fetcher";
import { ErrorResponse } from "@/helpers/error-response";
import { ResponseModel } from "@/types/common";
import VoltDetailsLayout from "@/components/volt-details/layout";
import { redirect } from "next/navigation";
import { PropertyDataSchema } from "@/zod-validations/volt-new";

export const getData = async (params: string): Promise<ResponseModel<z.infer<typeof PropertyDataSchema> | null>> => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set("getAll", "true");
    const req = await fetcher<Promise<z.infer<typeof PropertyDataSchema>>>(`properties/saleData?${params}`);
    const data = await PropertyDataSchema.safeParseAsync(req);

    return {
      errorMessage: null,
      data: data.data!,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};

const INITIAL_FILTERS = {
  radius: 10,
  acreageMin: null,
  acreageMax: null,
  propertyTypes: null,
  soldWithin: 2,
} as z.infer<typeof voltDetailsFiltersValidations>;

const VoltPropertyDetailsPage = async ({ searchParams, params }: { searchParams: { [key: string]: string }; params: { id: string } }) => {
  const filtersValidation = await voltDetailsFiltersValidations.safeParseAsync({
    ...searchParams,
  });

  if (filtersValidation.error) {
    const newParams = new URLSearchParams(searchParams);
    Object.keys(INITIAL_FILTERS).forEach((key) => {
      if (INITIAL_FILTERS[key as keyof typeof INITIAL_FILTERS]) {
        newParams.set(key, INITIAL_FILTERS[key as keyof typeof INITIAL_FILTERS]!?.toString());
      } else {
        newParams.delete(key);
      }
    });
    redirect(`/volt/${params.id}?${newParams.toString()}`);
  }

  const queryParams = new URLSearchParams(searchParams);
  queryParams.set("propertyId", params.id);
  const data = filtersValidation.data ? await getData(queryParams.toString()) : null;
  const propertyTypes = await fetcher<{ [key: string]: string }>("properties/propertyTypes");

  return (
    filtersValidation.data &&
    data?.data && (
      <VoltDetailsLayout propertyTypes={propertyTypes} data={data.data} initialFilters={INITIAL_FILTERS} searchParams={searchParams} />
    )
  );
};

export default VoltPropertyDetailsPage;
