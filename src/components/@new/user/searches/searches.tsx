"use client";

import React, { FC, ReactNode, useEffect, useOptimistic, useRef, useState, useTransition } from "react";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";
import { cn } from "@/lib/utils";
import NoResults from "@/components/ui/no-result";
import UserProfileSectionHeader from "@/components/@new/user/UserSectionHeading";
import SearchesFilters from "@/components/@new/user/searches/filters/filters";
import { ImSpinner8 } from "react-icons/im";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
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
  children: ReactNode;
}

const Searches: FC<SearchesProps> = ({ data, hasEntries, hasSearchResults, totalCount, rowsPerPage, children }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [filterChangePending, startFilterChangeTransition] = useTransition();
  const [viewDetailPending, startViewDetailTransition] = useTransition();
  const [viewId, setViewId] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const onView = (id: number) => {
    setViewId(id === viewId ? null : id);

    startViewDetailTransition(() => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("additionalData");
      if (id === viewId) {
        newSearchParams.delete("viewId");
      } else {
        newSearchParams.set("viewId", id.toString());
      }
      router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
    });
  };

  useEffect(() => {
    setViewId(Number(searchParams.get("viewId")) || null);
  }, [searchParams]);

  return (
    <>
      <div className="space-y-4 md:space-y-6 relative">
        <div className="space-y-5 md:space-y-8">
          <UserProfileSectionHeader title="Recent Searches" />
          <SearchesFilters startTransition={startFilterChangeTransition} />
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
              {filterChangePending && (
                <div className="absolute h-full w-full z-10 flex justify-center items-center bg-white/80 rounded-2xl animate-pulse">
                  <ImSpinner8 className="size-8 text-primary-main-200 animate-spin" />
                </div>
              )}
              {data?.map((el, elI) => (
                <div key={Math.random().toString()} className={cn(elI === data.length - 1 && "lg:[&_.content]:border-b-0")}>
                  <div
                    className={cn(
                      "grid grid-cols-[1fr_minmax(0,_max-content)] px-5 lg:px-6 py-5 lg:py-3 gap-3 items-center cursor-pointer hover:bg-primary-main-50",
                      "border rounded-2xl lg:border-0 lg:border-b lg:rounded-none",
                      viewId === el.id &&
                        !viewDetailPending &&
                        "border-b-0 !rounded-b-none lg:border-b-0 !bg-primary-main-50 lg:!bg-primary-main-100 border-primary-main-400"
                    )}
                    onClick={() => onView(el.id)}
                  >
                    <h1 className="truncate font-medium">{el.title}</h1>
                    {viewId === el.id && viewDetailPending && <AiOutlineLoading3Quarters className="animate-spin" />}
                    <div className={cn(viewId === el.id && viewDetailPending && "hidden")}>
                      {viewId === el.id ? <MdOutlineKeyboardArrowUp /> : <MdOutlineKeyboardArrowDown />}{" "}
                    </div>
                  </div>

                  {viewId === el.id && !viewDetailPending && children}
                </div>
              ))}
            </div>
            <SearchesPagination startTransition={startFilterChangeTransition} totalCount={totalCount} rowsPerPage={rowsPerPage} />
          </>
        )}
      </div>
    </>
  );
};

export default Searches;