import { cn } from "@/lib/utils";
import React from "react";
import { IoSearchSharp } from "react-icons/io5";

const NoSearchResult = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center flex-col gap-2", className)}>
    <div className="size-10 md:size-12 rounded-full bg-primary-dark-100 flex items-center justify-center">
      <IoSearchSharp className="size-5 md:size-6 text-primary-main" />
    </div>
    <h1 className="text-sm font-medium text-grey-800">No search results...</h1>
  </div>
);

export default NoSearchResult;
