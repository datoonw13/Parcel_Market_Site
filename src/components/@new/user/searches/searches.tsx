"use client";

import React, { FC, useEffect, useState, useTransition } from "react";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { getUserSearches } from "@/server-actions/user-searches/actions";
import { AsyncReturnType, IPagination, ResponseModel } from "@/types/common";
import NoResults from "@/components/ui/no-result";
import UserProfileSectionHeader from "@/components/@new/user/UserSectionHeading";
import SearchesFilters from "@/components/@new/user/searches/filters/filters";
import { ImSpinner8 } from "react-icons/im";
import SearchesSelect from "./select";
import SearchesPagination from "./pagination";

interface SearchesProps {
  data?: {
    title: string;
    id: number;
  }[];
  hasEntries: boolean;
  hasSearchResults: boolean;
  totalCount: number;
  rowsPerPage: number;
}

const Searches: FC<SearchesProps> = ({ data, hasEntries, hasSearchResults, totalCount, rowsPerPage }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="space-y-5 md:space-y-8">
        <UserProfileSectionHeader title="Recent Searches" />
        <SearchesFilters startTransition={startTransition} />
      </div>
      {!hasEntries && <NoResults errorMessage="No recent searches yet..." className="!mt-16" />}
      {hasEntries && !hasSearchResults && <NoResults errorMessage="No search results..." className="!mt-16" />}

      {hasEntries && hasSearchResults && (
        <>
          <SearchesSelect />
          <div
            className={cn(
              "lg:border lg:rounded-2xl lg:[&>div:last-child>div]:border-b-0 space-y-3 lg:space-y-0 lg:[&>div:last-child>div]:rounded-b-2xl lg:[&>div:first-child>div]:rounded-t-2xl relative"
            )}
          >
            {isPending && (
              <div className="absolute h-full w-full z-10 flex justify-center items-center bg-white/80 rounded-2xl animate-pulse">
                <ImSpinner8 className="size-8 text-primary-main-200 animate-spin" />
              </div>
            )}
            {data?.map((el, elI) => (
              <div key={Math.random().toString()}>
                <div
                  className={cn(
                    "grid grid-cols-[1fr_minmax(0,_max-content)] px-5 lg:px-6 py-5 lg:py-3 gap-3 items-center cursor-pointer hover:bg-primary-main-50",
                    "border rounded-2xl lg:border-0 lg:border-b lg:rounded-none",
                    false && "border-b-0 !rounded-b-none lg:border-b-0 !bg-primary-main-100 border-primary-main-400"
                  )}
                  // onClick={() => {}}
                >
                  <h1 className="truncate font-medium">{el.title}</h1>
                  <>{false ? <MdOutlineKeyboardArrowUp /> : <MdOutlineKeyboardArrowDown />}</>
                </div>
                {false && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, x: "100%" }}
                      transition={{ duration: 0.1, ease: "linear" }}
                      className="w-full"
                    >
                      <div
                        className={cn(
                          false &&
                            "border border-t-0 rounded-b-2xl lg:border-0 lg:border-b lg:rounded-b-none bg-primary-main-100 lg:bg-transparent border-primary-main-400 lg:border-b-grey-100",
                          "px-5 lg:px-6 py-6 md:py-3"
                        )}
                      >
                        Content Content Content Content Content Content{" "}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>
          <SearchesPagination startTransition={startTransition} totalCount={totalCount} rowsPerPage={rowsPerPage} />
        </>
      )}
    </div>
  );
};

export default Searches;
