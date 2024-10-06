"use client";

import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { moneyFormatter } from "@/helpers/common";
import { AccordionContent } from "@radix-ui/react-accordion";
import React, { useEffect, useState } from "react";
import { IUserRecentSearches } from "@/types/user";
import { useAtom } from "jotai";
import { userRecentSearchesAtom } from "@/atoms/pages-atom";
import { Checkbox } from "@/components/ui/checkbox";
import RecentSearchesPagination from "./pagination";

const UserRecentSearchesList = ({ pageSize, totalCount, data }: { pageSize: number; totalCount: number; data: IUserRecentSearches[] }) => {
  const [openItem, setOpenItem] = useState<string>("");
  const [userRecentSearchesOption, setUserRecentSearchesOptions] = useAtom(userRecentSearchesAtom);

  useEffect(() => {
    if (userRecentSearchesOption.selecting) {
      setOpenItem("");
    }
  }, [userRecentSearchesOption.selecting]);

  useEffect(
    () => () => {
      setUserRecentSearchesOptions({ selecting: false, selectedIds: [], isAllSelected: false });
    },
    [setUserRecentSearchesOptions]
  );

  useEffect(() => {
    setUserRecentSearchesOptions((prev) => ({
      ...prev,
      isAllSelected: userRecentSearchesOption.selectedIds.length === data.length,
    }));
  }, [data.length, setUserRecentSearchesOptions, userRecentSearchesOption.selectedIds]);

  return (
    <div className="space-y-8 md:space-y-11">
      <div>
        <Accordion
          type="single"
          collapsible
          value={openItem}
          onValueChange={(value) => !userRecentSearchesOption.selecting && setOpenItem(value)}
          className="w-full lg:border lg:rounded-2xl space-y-3 lg:space-y-0 lg:[&>div:last-child]:border-b-0"
        >
          {userRecentSearchesOption.selecting && (
            <AccordionItem value="select-all" className="border rounded-2xl lg:border-0 lg:border-b lg:rounded-none ">
              <AccordionTrigger
                onClick={() => {
                  if (userRecentSearchesOption.isAllSelected) {
                    setUserRecentSearchesOptions((prev) => ({
                      ...prev,
                      selectedIds: [],
                    }));
                  } else {
                    setUserRecentSearchesOptions((prev) => ({
                      ...prev,
                      selectedIds: data.map((el) => el.id),
                    }));
                  }
                }}
                className="px-5 lg:px-6 py-5 lg:py-3 text-start text-wrap grid grid-cols-[1fr_minmax(0,_max-content)] gap-3 [&>svg]:hidden"
              >
                <span className="truncate flex items-center gap-4">
                  {userRecentSearchesOption.selecting && (
                    <Checkbox checked={userRecentSearchesOption.isAllSelected} onChange={(e) => e.stopPropagation()} />
                  )}
                  Select All
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-5 lg:px-6">Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
            </AccordionItem>
          )}
          {data.map((search) => (
            <AccordionItem
              key={search.id}
              value={search.id.toString()}
              className="border rounded-2xl lg:border-0 lg:border-b lg:rounded-none"
            >
              <AccordionTrigger
                onClick={() => {
                  if (userRecentSearchesOption.selectedIds?.includes(search.id)) {
                    setUserRecentSearchesOptions((prev) => ({
                      ...prev,
                      selectedIds: prev.selectedIds?.filter((el) => el !== search.id) || null,
                    }));
                  } else {
                    setUserRecentSearchesOptions((prev) => ({
                      ...prev,
                      selectedIds: [...(prev.selectedIds || []), search.id],
                    }));
                  }
                }}
                className="px-5 lg:px-6 py-5 lg:py-3 text-start text-wrap grid grid-cols-[1fr_minmax(0,_max-content)] gap-3"
              >
                <span className="truncate flex items-center gap-4">
                  {userRecentSearchesOption.selecting && (
                    <Checkbox checked={!!userRecentSearchesOption.selectedIds?.includes(search.id)} onChange={(e) => e.stopPropagation()} />
                  )}
                  {search.state.label}/{search.county.label}/{search.acreage.toFixed(2)}/{moneyFormatter.format(search.price)}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-5 lg:px-6">Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <RecentSearchesPagination pageSize={pageSize} totalCount={totalCount} />
    </div>
  );
};

export default UserRecentSearchesList;
