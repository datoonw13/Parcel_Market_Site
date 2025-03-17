import React, { Suspense } from "react";
import SearchesWrapper from "@/components/@new/user/searches/searches-wrapper";
import { getUserSearches } from "@/server-actions/user-searches/actions";
import { userSearchesValidations } from "@/zod-validations/filters-validations";

const UserSearches = async ({ searchParams }: { searchParams: Record<string, string | null> }) => {
  const filters = userSearchesValidations.safeParse(searchParams);
  const data = await getUserSearches({ ...filters, page: 1, pageSize: 1 });
  const hasEntries = !!(data.data?.list && data.data.list.length > 0);

  return (
    filters.success && (
      <Suspense>
        <SearchesWrapper hasEntries={hasEntries} filters={filters.data} />
      </Suspense>
    )
  );
};

export default UserSearches;
