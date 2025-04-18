"use client";

import { TextInput } from "@/components/ui/input";
import { IoSearchOutline } from "react-icons/io5";
import { TransitionStartFunction, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import SearchesDesktopFilters from "./desktop";
import SearchesMobileFilters from "./mobile";

const SearchesFilters = ({ startTransition }: { startTransition: TransitionStartFunction }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleSearch = (value: string) => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("viewId");

      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    }, 300);
  };

  useEffect(
    () => () => {
      window.clearTimeout(timerRef.current);
    },
    []
  );

  return (
    <>
      <div className="grid grid-cols-[1fr_minmax(0,_max-content)] lg:grid-cols-1 2xl:grid-cols-[minmax(auto,_280px)_minmax(0,_max-content)] gap-3 2xl:gap-16 w-full justify-between items-center">
        <TextInput
          rootClassName="min-h-9 h-full rounded-3xl"
          className="text-grey-800 placeholder:text-grey-800 placeholder:text-xs text-xs font-medium"
          placeholder="Search by Parcel ID, or by owner "
          endIconClassName="p-[1px]"
          endIcon={
            <>
              {searchParams.get("search") && (
                <div
                  className="pr-4 mr-4 border-r cursor-pointer"
                  onClick={(e) => {
                    const inputEl = e.currentTarget.parentElement?.parentElement?.querySelector("input");
                    if (inputEl) {
                      inputEl.value = "";
                      const params = new URLSearchParams(searchParams.toString());
                      params.delete("search");
                      params.delete("viewId");
                      router.push(`${pathname}?${params.toString()}`);
                    }
                  }}
                >
                  <IoMdClose />
                </div>
              )}
              <div className="bg-primary-main h-full rounded-full text-white flex items-center justify-center cursor-pointer aspect-square">
                <IoSearchOutline />
              </div>
            </>
          }
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get("search") || ""}
        />
        <SearchesMobileFilters startTransition={startTransition} />
        <SearchesDesktopFilters startTransition={startTransition} />
      </div>
    </>
  );
};
export default SearchesFilters;
