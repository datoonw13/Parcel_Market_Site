"use client";

import React, { FC, useEffect, useOptimistic, useTransition } from "react";
import { getSearchDetails } from "@/server-actions/user-searches/actions";
import { AsyncReturnType } from "@/types/common";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";
import { cn } from "@/lib/utils";
import routes from "@/helpers/routes";
import ListItemHeader from "./list-item-header";
import ListItemContent from "./list-item-content";

interface ListItemProps {
  data?: any;
  viewId: number | null;
  loading?: boolean;
  searchData: AsyncReturnType<typeof getSearchDetails> | null;
}
const ListItem: FC<ListItemProps> = ({ data, viewId, loading, searchData }) => {
  console.log(viewId, 11);

  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isTransitionPending, startTransition] = useTransition();
  const [optimisticLoadingState, setOptimisticLoadingSate] = useOptimistic(false, (value, newValue: boolean) => newValue);
  const [optimisticOpenState, setOptimisticOpenState] = useOptimistic(viewId === data?.id, (value, newValue: boolean) => newValue);
  const isPending = loading || optimisticLoadingState;
  const isOpen = viewId === data?.id && optimisticOpenState && !isPending;

  const handleOptimistic = (isOpenState: boolean) => {
    startTransition(() => {
      if (isOpenState) {
        setOptimisticLoadingSate(true);
        setOptimisticOpenState(true);
      } else {
        setOptimisticLoadingSate(false);
        setOptimisticOpenState(false);
      }
    });
  };

  const handleCollapse = () => {
    const searchParams = new URLSearchParams(params.toString());
    if (Number(searchParams.get("viewId")) === data.id) {
      searchParams.delete("viewId");
      handleOptimistic(false);
    } else {
      searchParams.set("viewId", data.id.toString());
      handleOptimistic(true);
    }
    // Temp fix to make route update fast
    window.history.pushState(null, pathname, `?${searchParams.toString()}`);
    router.push(`${pathname}?${searchParams.toString()}`);
  };

  return (
    <div className="">
      <div
        onClick={handleCollapse}
        className={cn(
          "item cursor-pointer px-5 lg:px-6 py-5 lg:py-3 grid grid-cols-[1fr_minmax(0,_max-content)] items-center gap-3",
          "border rounded-2xl lg:border-0 lg:rounded-none lg:border-b",
          isOpen && "lg:border-b-0 border-[#9FD1B3] bg-primary-main-50 lg:hover:border-b-[#9FD1B3] lg:hover:bg-primary-main-50"
        )}
      >
        <h2 className="text-sm font-medium truncate inline-block">{data?.title}</h2>
        {isPending ? (
          <AiOutlineLoading3Quarters className="animate-spin" />
        ) : (
          <>{isOpen ? <MdOutlineKeyboardArrowUp /> : <MdOutlineKeyboardArrowDown />}</>
        )}
      </div>
      {isOpen && <ListItemContent />}
    </div>
  );
};

export default ListItem;
