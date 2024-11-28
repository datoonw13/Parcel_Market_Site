import RecentSearchesHeader from "@/components/@new/user/recent-searches/header";
import UserRecentSearchesListWrapper from "@/components/@new/user/recent-searches/list-wrapper";
import UserRecentSearchesLoader from "@/components/@new/user/recent-searches/loader";
import routes from "@/helpers/routes";
import { getUserSearches } from "@/server-actions/user-searches/actions";
import { userRecentSearchesValidations } from "@/zod-validations/filters-validations";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const ROWS_PER_PAGE = 15;

const RecentSearchesPage = async ({ searchParams }: { searchParams: Record<string, string | null> }) => {
  const data = await getUserSearches({ page: 1, pageSize: 1 });
  const filters = userRecentSearchesValidations.safeParse(searchParams);

  return (
    <div className="space-y-4 md:space-y-6">
      <RecentSearchesHeader />
      {filters.success && (
        <Suspense key={JSON.stringify(filters.data)} fallback={<UserRecentSearchesLoader />}>
          <UserRecentSearchesListWrapper
            filters={filters.data}
            pageSize={ROWS_PER_PAGE}
            totalItems={data.data?.pagination.totalCount || 0}
            viewId={searchParams?.viewId ? Number(searchParams.viewId) : null}
          />
        </Suspense>
      )}
    </div>
  );
};

export default RecentSearchesPage;
