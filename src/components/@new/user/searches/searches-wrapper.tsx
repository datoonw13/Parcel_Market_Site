import { z } from "zod";
import { userSearchesValidations } from "@/zod-validations/filters-validations";
import { getUserSearches } from "@/server-actions/user-searches/actions";
import { Suspense } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Searches from "./searches";
import SearchDetailsWrapper from "./details/details-wrapper";

const ROWS_PER_PAGE = 15;

const SearchesWrapper = async ({
  filters,
  hasEntries,
  viewId,
}: {
  filters: z.infer<typeof userSearchesValidations>;
  hasEntries: boolean;
  viewId: number | null;
}) => {
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
      >
        {viewId && (
          <Suspense
            fallback={
              <div className="lg:hidden flex items-center justify-center border border-t-0 rounded-b-2xl min-h-44 h-full bg-primary-main-100 border-primary-main-400 animate-pulse">
                <AiOutlineLoading3Quarters className="animate-spin size-6 text-primary-main" />
              </div>
            }
          >
            <SearchDetailsWrapper id={viewId} />
          </Suspense>
        )}
      </Searches>
    </div>
  );
};

export default SearchesWrapper;
