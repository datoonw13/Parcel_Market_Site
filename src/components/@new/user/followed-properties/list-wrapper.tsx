import { z } from "zod";
import { userPropertiesFiltersValidations } from "@/zod-validations/filters-validations";
import { getUserFollowedListingAction } from "@/server-actions/follow/actions";
import UserFollowedPropertiesList from "./list";

const UserFollowedPropertiesListWrapper = async ({
  pageSize,
  totalItems,
  filters,
}: {
  pageSize: number;
  totalItems: number;
  filters: z.infer<typeof userPropertiesFiltersValidations>;
}) => {
  const { data } = await getUserFollowedListingAction(pageSize, filters);
  return <UserFollowedPropertiesList pageSize={pageSize} data={data} filters={filters} totalItems={totalItems} />;
};

export default UserFollowedPropertiesListWrapper;
