"use client";

import { userSearchesAtom } from "@/atoms/pages-atom";
import useNotification from "@/hooks/useNotification";
import { useAtom } from "jotai";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { removeUserSearches } from "@/server-actions/user-searches/actions";
import { SortEnum } from "@/types/common";
import { updateSearchParamsWithFilters } from "@/lib/utils";
import { z } from "zod";
import { userSearchesValidations } from "@/zod-validations/filters-validations";
import UserSelectListItems from "../shared/select-list-items";

const SearchesSelect = () => {
  const { notify } = useNotification();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [userSearchesOption, setUserSearchesOptions] = useAtom(userSearchesAtom);

  const onSortValueChange = (value?: string | null) => {
    const newSearchParams = updateSearchParamsWithFilters<z.infer<typeof userSearchesValidations>>(
      [{ key: "sortBy", value }],
      searchParams.toString()
    );
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const onSelectButtonClick = () => {
    setUserSearchesOptions((prev) => ({
      ...prev,
      selecting: !prev.selecting,
      selectedIds: prev.selecting ? [] : prev.selectedIds,
    }));
  };

  const onRemoveSucceed = () => {
    setUserSearchesOptions({ isAllSelected: false, selectedIds: [], selecting: false });
    notify({ title: "Success!", description: "Your selected searches have been successfully deleted" });
  };

  const onRemove = () => removeUserSearches(userSearchesOption.selectedIds);

  return (
    <UserSelectListItems
      isAllSelected={userSearchesOption.isAllSelected}
      selecting={userSearchesOption.selecting}
      totalSelectedIds={userSearchesOption.selectedIds.length}
      totalItems={0}
      onSelectClick={onSelectButtonClick}
      dialogTitle="Delete Selected Searches?"
      dialogDescription="Are you sure you want to delete selected Searches?"
      onRemove={onRemove}
      onRemoveSuccess={onRemoveSucceed}
      sortEnum={SortEnum}
      sortChange={onSortValueChange}
      totalLabel="Lands"
      label="Sort By"
      selectedFilter={searchParams.get("sortBy")}
    />
  );
};

export default SearchesSelect;
