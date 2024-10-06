import RecentSearchesHeader from "@/components/@new/user/recent-searches/header";
import UserRecentSearchesList from "@/components/@new/user/recent-searches/list";
import UserRecentSearchesLoader from "@/components/@new/user/recent-searches/loader";
import { getUserSearches } from "@/server-actions/user-searches/actions";
import { userRecentSearchesValidations } from "@/zod-validations/filters-validations";
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
          <UserRecentSearchesList filters={filters.data} pageSize={ROWS_PER_PAGE} totalItems={data.data?.pagination.totalCount || 0} />
        </Suspense>
      )}
    </div>
  );
};

export default RecentSearchesPage;
