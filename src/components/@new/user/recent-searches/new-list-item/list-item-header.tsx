"use client";

import LoadingCircle from "@/icons/LoadingCircle";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { FC, useOptimistic, useState, useTransition } from "react";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utils";

interface ListItemHeaderProps {
  data: { title: string; id: number };
  loading?: boolean;
  viewId: number | null;
}
const ListItemHeader: FC<ListItemHeaderProps> = ({ data, loading, viewId }) => {
  const [isTransitionPending, startTransition] = useTransition();
  const [optimisticLoadingState, setOptimisticLoadingSate] = useOptimistic(false, (value, newValue: boolean) => newValue);
  const [optimisticOpenState, setOptimisticOpenState] = useOptimistic(viewId === data.id, (value, newValue: boolean) => newValue);
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const isPending = loading || optimisticLoadingState;
  const isOpen = viewId === data.id && optimisticOpenState && !isPending;

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
    const newSearchParams = new URLSearchParams(params.toString());
    if (Number(newSearchParams.get("viewId")) === data.id) {
      newSearchParams.delete("viewId");
      handleOptimistic(false);
    } else {
      newSearchParams.set("viewId", data.id.toString());
      handleOptimistic(true);
    }
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <div
      onClick={handleCollapse}
      className={cn(
        "item cursor-pointer px-5 lg:px-6 py-5 lg:py-3 grid grid-cols-[1fr_minmax(0,_max-content)] items-center gap-3",
        "border rounded-2xl lg:border-0 lg:rounded-none lg:border-b",
        isOpen && "lg:border-b-0 border-[#9FD1B3] bg-primary-main-50 lg:hover:border-b-[#9FD1B3] lg:hover:bg-primary-main-50"
      )}
    >
      <h2 className="text-sm font-medium truncate inline-block">{data.title}</h2>
      {isPending ? (
        <AiOutlineLoading3Quarters className="animate-spin" />
      ) : (
        <>{isOpen ? <MdOutlineKeyboardArrowUp /> : <MdOutlineKeyboardArrowDown />}</>
      )}
    </div>
  );
};

export default ListItemHeader;
