import NoSearchResult from "@/components/ui/no-search-result";
import { getUserSearches } from "@/server-actions/user-searches/actions";
import { userRecentSearchesValidations } from "@/zod-validations/filters-validations";
import { z } from "zod";
import { getUserAction } from "@/server-actions/user/actions";
import { getUserSubscriptions } from "@/server-actions/subscription/actions";
import UserRecentSearchesList from "./list";

const UserRecentSearchesListWrapper = async ({
  filters,
  pageSize,
  totalItems,
}: {
  filters: z.infer<typeof userRecentSearchesValidations>;
  pageSize: number;
  totalItems: number;
}) => {
  const user = await getUserAction();
  const userSubscription = await getUserSubscriptions();
  const isUserSubscriptionTrial = !!userSubscription.data?.find((el) => el.status === "trialing");

  const { data } = await getUserSearches({ ...filters, page: filters.page || 1, pageSize });

  if (totalItems > 0 && data?.list.length === 0) {
    return <NoSearchResult className="!mt-16" />;
  }

  return (
    !!data && (
      <UserRecentSearchesList
        isUserSubscriptionTrial={isUserSubscriptionTrial}
        user={user}
        pageSize={pageSize}
        totalCount={data?.pagination.totalCount || 0}
        data={data?.list}
      />
    )
  );
};

export default UserRecentSearchesListWrapper;
