"use client";

import { TextInput } from "@/components/ui/input";
import { IoSearchOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { userRecentSearchesAtom } from "@/atoms/pages-atom";
import { cn } from "@/lib/utils";
import { RiDeleteBin6Line } from "react-icons/ri";
import ResponsiveAlertDialog from "@/components/ui/dialogs/responsive-alert-dialog";
import { removeUserSearches } from "@/server-actions/user-searches/actions";
import useNotification from "@/hooks/useNotification";
import RecentSearchesDesktopFilters from "./desktop";
import RecentSearchesMobileFilters from "./mobile";

const RecentSearchesFilters = ({ totalItems }: { totalItems: number }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const [openWarningModal, setWarningModal] = useState(false);
  const [removePending, setRemovePending] = useState(false);
  const [userRecentSearchesOption, setUserRecentSearchesOptions] = useAtom(userRecentSearchesAtom);
  const { notify } = useNotification();

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

  const selectText = () => {
    if (userRecentSearchesOption.selecting) {
      if (userRecentSearchesOption.isAllSelected) {
        return "All Selected";
      }

      return `${
        userRecentSearchesOption.selecting && userRecentSearchesOption.selectedIds.length > 0
          ? userRecentSearchesOption.selectedIds.length
          : ""
      } Select`;
    }
    return "Select";
  };

  useEffect(
    () => () => {
      window.clearTimeout(timerRef.current);
    },
    []
  );

  return (
    <>
      <ResponsiveAlertDialog
        variant="error"
        title="Delete Selected Searches?"
        description="Are you sure you want to delete selected Searches?"
        cancelButton={{
          label: "Cancel",
          onClick: () => setWarningModal(false),
          show: true,
        }}
        okButton={{
          label: "Delete",
          onClick: async () => {
            setRemovePending(true);
            const { errorMessage } = await removeUserSearches(userRecentSearchesOption.selectedIds);
            setRemovePending(false);

            if (!errorMessage) {
              setUserRecentSearchesOptions({ isAllSelected: false, selectedIds: [], selecting: false });
              setWarningModal(false);
            } else {
              notify({ title: "Error", description: errorMessage }, { variant: "error" });
            }
          },
          pending: removePending,
          show: true,
        }}
        closeModal={() => setWarningModal(false)}
        open={openWarningModal}
      />
      <div className="flex flex-col w-full gap-4 md:gap-7">
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
            defaultValue={searchParams.get("search") || ""}
          />
          <RecentSearchesMobileFilters />
          <RecentSearchesDesktopFilters />
        </div>
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <Button
              className={cn(
                "bg-grey-50 hover:bg-gray-200 !text-black font-medium text-xs py-1 px-3 h-fit rounded-2xl",
                userRecentSearchesOption.selecting && "!bg-grey-400"
              )}
              onClick={() =>
                setUserRecentSearchesOptions((prev) => ({
                  ...prev,
                  selecting: !prev.selecting,
                  selectedIds: prev.selecting ? [] : prev.selectedIds,
                }))
              }
            >
              {selectText()}
            </Button>
            {userRecentSearchesOption.selectedIds.length > 0 && (
              <div
                onClick={() => setWarningModal(true)}
                className="size-8 flex items-center justify-center rounded-full hover:bg-error-100 hover:text-error cursor-pointer"
              >
                <RiDeleteBin6Line />
              </div>
            )}
          </div>
          <div>{!!totalItems && <p className="text-xs font-medium text-grey-600">{totalItems} Lands</p>}</div>
        </div>
      </div>
    </>
  );
};
export default RecentSearchesFilters;
