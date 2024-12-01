import SearchesFilters from "@/components/@new/user/searches/filters/filters";
import Searches from "@/components/@new/user/searches/searches";
import SearchesWrapper from "@/components/@new/user/searches/searches-wrapper";
import UserProfileSectionHeader from "@/components/@new/user/UserSectionHeading";
import { getUserSearches } from "@/server-actions/user-searches/actions";
import { userSearchesValidations } from "@/zod-validations/filters-validations";
import React, { Suspense } from "react";
import SearchesLoading from "./loading";

const UserSearches = async ({ searchParams }: { searchParams: Record<string, string | null> }) => {
  const data = await getUserSearches({ page: 1, pageSize: 1 });
  const filters = userSearchesValidations.safeParse(searchParams);
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
