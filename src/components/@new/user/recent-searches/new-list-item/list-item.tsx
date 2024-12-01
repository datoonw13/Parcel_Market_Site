"use client";

import React, { FC, useEffect, useOptimistic, useTransition } from "react";
import { getSearchDetails } from "@/server-actions/user-searches/actions";
import { AsyncReturnType } from "@/types/common";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";
import { cn } from "@/lib/utils";
import routes from "@/helpers/routes";
import { IUserRecentSearches } from "@/types/user";
import useMediaQuery from "@/hooks/useMediaQuery";
import ListItemHeader from "./list-item-header";
import ListItemContent from "./list-item-content";
import { breakPoints } from "../../../../../../tailwind.config";

interface ListItemProps {
  data?: any;
  viewId: number | null;
  loading?: boolean;
  searchData: IUserRecentSearches | null;
  isLast: boolean;
  isFirst: boolean;
}
const ListItem: FC<ListItemProps> = ({ data, viewId, loading, searchData, isFirst, isLast }) => {
  const { targetReached: isSmallDevice } = useMediaQuery(parseFloat(breakPoints.lg));
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const isPending = false;
  const isOpen = false;

  const handleCollapse = () => {};

  if (isSmallDevice) {
    return (
      <div
        onClick={handleCollapse}
        className={cn(
          "px-5 py-6 item cursor-pointer flex flex-col items-center gap-3 hover:bg-primary-main-50 rounded-2xl border",
          isOpen && "!bg-primary-main-50"
        )}
      >
        <div className="grid grid-cols-[1fr_minmax(0,_max-content)] justify-between items-center w-full">
          <h2 className="text-sm font-medium truncate inline-block">{data?.title}</h2>
          {isPending ? (
            <AiOutlineLoading3Quarters className="animate-spin" />
          ) : (
            <>{isOpen ? <MdOutlineKeyboardArrowUp /> : <MdOutlineKeyboardArrowDown />}</>
          )}
        </div>
        {isOpen && searchData && <ListItemContent isLast={isLast} data={searchData} />}
      </div>
    );
  }

  return (
    <div className="">
      <div
        onClick={handleCollapse}
        className={cn(
          "item cursor-pointer px-6 py-3 grid grid-cols-[1fr_minmax(0,_max-content)] items-center gap-3  hover:bg-primary-main-50",
          "border-0 border-b",
          isOpen && "border-b-primary-main-400 !bg-primary-main-100 !rounded-b-none",
          isFirst && "rounded-t-2xl",
          isLast && "rounded-b-2xl"
        )}
      >
        <h2 className="text-sm font-medium truncate inline-block">{data?.title}</h2>
        {isPending ? (
          <AiOutlineLoading3Quarters className="animate-spin" />
        ) : (
          <>{isOpen ? <MdOutlineKeyboardArrowUp /> : <MdOutlineKeyboardArrowDown />}</>
        )}
      </div>
      {isOpen && searchData && <ListItemContent isLast={isLast} data={searchData} />}
    </div>
  );
};

export default ListItem;
