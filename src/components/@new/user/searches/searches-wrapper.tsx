import { z } from "zod";
import { userSearchesValidations } from "@/zod-validations/filters-validations";
import { getUserSearches } from "@/server-actions/user-searches/actions";
import Searches from "./searches";

const ROWS_PER_PAGE = 15;

const SearchesWrapper = async ({ filters, hasEntries }: { filters: z.infer<typeof userSearchesValidations>; hasEntries: boolean }) => {
  const { data } = await getUserSearches({ ...filters, page: filters.page || 1, pageSize: ROWS_PER_PAGE });
  const hasSearchResults = !!(data?.list && data?.list.length > 0);

  return (
    <div className="">
      <Searches
        data={data?.list}
        hasEntries={hasEntries}
        hasSearchResults={hasSearchResults}
        totalCount={data?.pagination.totalCount || 0}
        rowsPerPage={ROWS_PER_PAGE}
      />
    </div>
  );
};

export default SearchesWrapper;
