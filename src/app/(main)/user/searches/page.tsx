import React, { Suspense } from "react";
import SearchesWrapper from "@/components/@new/user/searches/searches-wrapper";
import { getUserSearches } from "@/server-actions/user-searches/actions";
import { userSearchesValidations } from "@/zod-validations/filters-validations";

const UserSearches = async ({ searchParams }: { searchParams: Record<string, string | null> }) => {
  const data = await getUserSearches({ page: 1, pageSize: 1 });
  const filters = userSearchesValidations.safeParse(searchParams);
  const hasEntries = !!(data.data?.list && data.data.list.length > 0);
  return (
    filters.success && (
      <Suspense>
        <SearchesWrapper hasEntries={hasEntries} filters={filters.data} viewId={Number(searchParams.viewId) || null} />
      </Suspense>
    )
  );
};

export default UserSearches;
