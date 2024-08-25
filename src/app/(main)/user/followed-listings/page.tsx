import { getUserAction } from "@/server-actions/user/actions";
import { Suspense } from "react";
import { z } from "zod";
import { userPropertiesFiltersValidations } from "@/zod-validations/filters-validations";
import { redirect } from "next/navigation";
import routes from "@/helpers/routes";
import UserFollowedPropertiesListLoading from "@/components/@new/user/followed-properties/list-loading";
import FollowedProperties from "@/components/@new/user/followed-properties/followed-properties";
import { getUserFollowedListingAction } from "@/server-actions/follow/actions";
import UserFollowedPropertiesList from "@/components/@new/user/followed-properties/list";

const PAGE_SIZE = 6;
const UserFollowedPropertiesPage = async ({ searchParams }: { searchParams: any }) => {
  const user = await getUserAction();
  const { data } = await getUserFollowedListingAction(PAGE_SIZE);
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
    <FollowedProperties filters={filters.data} user={user} totalItems={totalItems}>
      <Suspense key={JSON.stringify(filters.data)} fallback={<UserFollowedPropertiesListLoading />}>
        <UserFollowedPropertiesList pageSize={PAGE_SIZE} totalItems={totalItems} filters={filters.data} />
      </Suspense>
    </FollowedProperties>
  );
};

export default UserFollowedPropertiesPage;
