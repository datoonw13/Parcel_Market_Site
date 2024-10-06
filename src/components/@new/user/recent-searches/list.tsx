import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { moneyFormatter } from "@/helpers/common";
import { getUserSearches } from "@/server-actions/user-searches/actions";
import { userRecentSearchesValidations } from "@/zod-validations/filters-validations";
import { AccordionContent } from "@radix-ui/react-accordion";
import React from "react";
import { z } from "zod";
import NoSearchResult from "@/components/ui/no-search-result";
import RecentSearchesPagination from "./pagination";

const UserRecentSearchesList = async ({
  filters,
  pageSize,
  totalItems,
}: {
  filters: z.infer<typeof userRecentSearchesValidations>;
  pageSize: number;
  totalItems: number;
}) => {
  const { data } = await getUserSearches({ ...filters, page: filters.page || 1, pageSize });

  if (totalItems > 0 && data?.list.length === 0) {
    return <NoSearchResult className="!mt-16" />;
  }

  return (
    <div className="space-y-8 md:space-y-11">
      <div>
        <Accordion
          type="single"
          collapsible
          className="w-full lg:border lg:rounded-2xl space-y-3 lg:space-y-0 lg:[&>div:last-child]:border-b-0"
        >
          {data?.list.map((search) => (
            <AccordionItem
              key={search.id}
              value={search.id.toString()}
              className="border rounded-2xl lg:border-0 lg:border-b lg:rounded-none"
            >
              <AccordionTrigger className="px-5 lg:px-6 py-5 lg:py-3 text-start text-wrap grid grid-cols-[1fr_minmax(0,_max-content)] gap-3">
                <span className="truncate">
                  {search.state.label}/{search.county.label}/{search.acreage.toFixed(2)}/{moneyFormatter.format(search.price)}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-5 lg:px-6">Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <RecentSearchesPagination pageSize={pageSize} totalCount={data?.pagination.totalCount || 0} />
    </div>
  );
};

export default UserRecentSearchesList;
