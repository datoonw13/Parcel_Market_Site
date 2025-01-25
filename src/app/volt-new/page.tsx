import VoltDesktopSearchWrapper from "@/components/volt-new/search/search-wrapper-desktop";
import SearchResultsLoading from "@/components/volt-new/search/results/search-results-loading";
import VoltSearchResultsWrapper from "@/components/volt-new/search/results/search-results-wrapper";
import VoltSearchWrapper from "@/components/volt-new/search/search-wrapper";
import { Suspense } from "react";

const VoltPage = ({ searchParams }: { searchParams: { [key: string]: string } }) => (
  <div>
    <VoltSearchWrapper>
      <Suspense key={JSON.stringify(searchParams)} fallback={<SearchResultsLoading />}>
        <VoltSearchResultsWrapper searchParams={searchParams} />
      </Suspense>
    </VoltSearchWrapper>
  </div>
);

export default VoltPage;
