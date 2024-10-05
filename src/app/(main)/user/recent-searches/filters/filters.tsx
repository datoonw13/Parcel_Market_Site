"use client";

import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input";
import { IoSearchOutline } from "react-icons/io5";
import { TbFilter } from "react-icons/tb";
import RecentSearchesDesktopFilters from "./desktop";

const RecentSearchesFilters = () => {
  const filters = {
    state: "",
    county: "",
  };
  return (
    <div className="grid grid-cols-[minmax(auto,_324px)_minmax(0,_max-content)] gap-3 md:gap-16 w-full justify-between items-center">
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
      />
      <div className="md:hidden ml-auto">
        <Button className="p-2.5 h-fit !bg-transparent text-grey-800 border border-grey-100 !rounded-xl">
          <TbFilter className="size-5" style={{ transform: "scale(-1, 1)" }} />
        </Button>
      </div>
      <RecentSearchesDesktopFilters />
    </div>
  );
};
export default RecentSearchesFilters;
