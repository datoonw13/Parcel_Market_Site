import { getUserAction } from "@/server-actions/user/actions";
import Listings from "@/components/@new/user/properties/properties";
import { getUserListingAction } from "@/server-actions/user-listings/actions";
import UserPropertiesList from "@/components/@new/user/properties/properties-list";
import { Suspense } from "react";
import { z } from "zod";
import { userPropertiesFiltersValidations } from "@/zod-validations/filters-validations";
import { redirect } from "next/navigation";
import routes from "@/helpers/routes";
import UserPropertiesListLoading from "@/components/@new/user/properties/list-loading";

const PAGE_SIZE = 6;
const UserPropertiesPage = async ({ searchParams }: { searchParams: any }) => {
  const user = await getUserAction();
  const { data } = await getUserListingAction(PAGE_SIZE);
  const totalItems = data?.pagination.totalCount || 0;
  const selectedFilters: z.infer<typeof userPropertiesFiltersValidations> = {
    states: searchParams?.states?.split(",") || null,
    counties: searchParams.counties?.split(",") || null,
    page: Number(searchParams?.page) || 1,
    sortBy: (searchParams?.sortBy as any) || null,
    voltPriceMin: Number(searchParams.voltPriceMin) || null,
    voltPriceMax: Number(searchParams.voltPriceMax) || null,
    acreageMin: Number(searchParams.acreageMin) || null,
    acreageMax: Number(searchParams.acreageMax) || null,
  };
  const filters = await userPropertiesFiltersValidations.safeParseAsync(selectedFilters);

  if (!filters.success) {
    redirect(routes.user.properties.fullUrl);
  }

  return (
    <Listings filters={filters.data} user={user} totalItems={totalItems}>
      <Suspense key={JSON.stringify(filters.data)} fallback={<UserPropertiesListLoading />}>
        <UserPropertiesList pageSize={PAGE_SIZE} totalItems={totalItems} filters={filters.data} />
      </Suspense>
    </Listings>
  );
};

export default UserPropertiesPage;
