import { ArrowIconsUnion1 } from "@/components/@new/icons/ArrowIcons";
import { SortIcon1 } from "@/components/@new/icons/SortIcons";
import Button from "@/components/@new/shared/forms/Button";
import React from "react";

const LandsMobileFilters = () => (
  <div className="flex justify-between items-center w-full">
    <div className="flex items-center gap-1 border border-grey-100 rounded-3xl h-9 px-4 cursor-pointer">
      <p className="text-xs font-medium">Filter</p> <SortIcon1 className="h-6 w-6" />
    </div>
    <div className="flex items-center gap-4">
      <Button className="!rounded-3xl !h-[30px] !bg-grey-50 !text-black !text-xs !border-0 !shadow-none !px-3">Select</Button>
      <div className="flex items-center gap-2 cursor-pointer">
        <p className="font-medium text-xs capitalize">{false ? false : "Sort by"}</p>
        <ArrowIconsUnion1 className="h-2 w-2" />
      </div>
    </div>
  </div>
);

export default LandsMobileFilters;
