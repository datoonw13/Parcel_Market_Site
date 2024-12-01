import NoResults from "@/components/ui/no-result";
import { getUserSearches } from "@/server-actions/user-searches/actions";
import { userSearchesValidations } from "@/zod-validations/filters-validations";
import { z } from "zod";
import { getUserAction } from "@/server-actions/user/actions";
import { getUserSubscriptions } from "@/server-actions/subscription/actions";
import { Suspense } from "react";
import routes from "@/helpers/routes";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import UserRecentSearchesList from "./list";
import ListItem from "./new-list-item/list-item";
import ListItemHeader from "./new-list-item/list-item-header";
import ListItemWrapper from "./new-list-item/list-item-wrapper";

const UserRecentSearchesListWrapper = async ({
  filters,
  pageSize,
  totalItems,
  viewId,
}: {
  filters: z.infer<typeof userSearchesValidations>;
  pageSize: number;
  totalItems: number;
  viewId: number | null;
}) => {
  const user = await getUserAction();
  const userSubscription = await getUserSubscriptions();
  const isUserSubscriptionTrial = !!userSubscription.data?.find((el) => el.status === "trialing");

  const { data } = await getUserSearches({ ...filters, page: filters.page || 1, pageSize });

  if (!totalItems && viewId) {
    console.log("aee");

    // redirect(routes.user.recentSearches.fullUrl);
  }

  if (totalItems === 0 || !data) {
    return <NoResults errorMessage="No recent searches yet..." className="!mt-16" />;
  }

  if (totalItems > 0 && data?.list.length === 0) {
    return <NoResults errorMessage="No search results..." className="!mt-16" />;
  }

  return (
    <div className={cn("w-full lg:border lg:rounded-2xl space-y-3 lg:space-y-0  ")}>
      {data.list.map((el, elI) => (
        <Suspense key={viewId === el.id ? new Date().toISOString() : el.id} fallback={<ListItemHeader data={el} viewId={viewId} loading />}>
          <ListItemWrapper isLast={elI === data.list.length - 1} isFirst={elI === 0} data={el} viewId={viewId} />
        </Suspense>
      ))}
    </div>
  );
};

export default UserRecentSearchesListWrapper;

// <UserRecentSearchesList
// isUserSubscriptionTrial={isUserSubscriptionTrial}
// user={user}
// pageSize={pageSize}
// totalCount={data?.pagination.totalCount || 0}
// data={data?.list}
// />
