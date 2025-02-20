import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { z } from "zod";
import { fetcher } from "@/server-actions/fetcher";
import { ErrorResponse } from "@/helpers/error-response";
import { ResponseModel } from "@/types/common";
import VoltDetailsLayout from "@/components/volt-details/layout";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import { getUserAction } from "@/server-actions/user/actions";
import { redirect } from "next/navigation";
import routes from "@/helpers/routes";
// import x from "../../../../public/test.json";

const getData = async (params: string): Promise<ResponseModel<z.infer<typeof PropertyDataSchema> | null>> => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set("getAll", "true");
    const user = await getUserAction();
    const req = await fetcher<Promise<z.infer<typeof PropertyDataSchema>>>(`properties/saleData?${params}`);

    const data = await PropertyDataSchema.parseAsync({ acreageRange: { min: 1, max: 5 }, ...req, subscribed: true });
    return {
      errorMessage: null,
      data,
    };
  } catch (error: any) {
    if (error?.digest as any) {
      delete error.digest;
    }
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};

const VoltPropertyDetailsPage = async ({ searchParams, params }: { searchParams: { [key: string]: string }; params: { id: string } }) => {
  const filtersValidation = await voltDetailsFiltersValidations.parseAsync({
    ...searchParams,
  });

  const queryParamsObj = Object.keys(filtersValidation).reduce(
    (acc, cur) => ({
      ...acc,
      ...(filtersValidation[cur as keyof typeof filtersValidation] && { [cur]: filtersValidation[cur as keyof typeof filtersValidation] }),
    }),
    {}
  );

  const queryParams = new URLSearchParams(queryParamsObj);
  queryParams.set("propertyId", params.id);
  const data = await getData(queryParams.toString());
  const propertyTypes = await fetcher<Array<{ id: number; group: "vacant-land" | "other"; value: string }>>("properties/propertyTypes");
  const user = await getUserAction();

  if (process.env.NEXT_PUBLIC_ENVIRONMENT !== "development" && data.errorMessage) {
    redirect(routes.volt.fullUrl);
  }

  if (process.env.NEXT_PUBLIC_ENVIRONMENT === "development" && data.errorMessage) {
    return <div className="p-5 bg-error-400 rounded-2xl">{data.errorMessage}</div>;
  }

  return <VoltDetailsLayout isSubscribed={true} propertyTypes={propertyTypes} data={data.data!} />;
};

export default VoltPropertyDetailsPage;
