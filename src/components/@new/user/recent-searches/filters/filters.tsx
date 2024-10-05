"use client";

import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input";
import { IoSearchOutline } from "react-icons/io5";
import { TbFilter } from "react-icons/tb";
import { Suspense, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import RecentSearchesDesktopFilters from "./desktop";

const RecentSearchesFilters = () => {
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
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      router.push(`${pathname}?${params.toString()}`);
    }, 300);
  };

  useEffect(
    () => () => {
      window.clearTimeout(timerRef.current);
    },
    []
  );

  return (
    <div className="grid grid-cols-[1fr_minmax(0,_max-content)] 2xl:grid-cols-[minmax(auto,_280px)_minmax(0,_max-content)] gap-3 2xl:gap-16 w-full justify-between items-center">
      <TextInput
        rootClassName="min-h-9 h-full rounded-3xl"
        className="text-grey-800 placeholder:text-grey-800 placeholder:text-xs text-xs font-medium"
        placeholder="Search by Parcel ID, or by owner "
        endIconClassName="p-[1px]"
        endIcon={
          <div className="bg-primary-main h-full rounded-full text-white flex items-center justify-center cursor-pointer aspect-square">
            <IoSearchOutline />
          </div>
        }
        onChange={(e) => handleSearch(e.target.value)}
        value={searchParams.get("search") || ""}
      />
      <div className="2xl:hidden ml-auto">
        <Button className="p-2.5 h-fit !bg-transparent text-grey-800 border border-grey-100 !rounded-xl">
          <div className="flex gap-2 items-center">
            <TbFilter className="size-5" style={{ transform: "scale(-1, 1)" }} />
            <span className="hidden md:block text-grey-600">Filter</span>
          </div>
        </Button>
      </div>
      <Suspense>
        <RecentSearchesDesktopFilters />
      </Suspense>
    </div>
  );
};
export default RecentSearchesFilters;
