"use client";

import { SortEnum } from "@/types/common";
import Sort from "../../shared/filters/Sort";
import SelectButton from "../../shared/forms/Button/SelectButton";
import UserListingsMobileFilter from "./user-listing-mobile-filters";

const UserListingHeader = ({ totalCount }: { totalCount: number }) => (
  <div className="flex items-center gap-3 sm:justify-between sm:w-full">
    <div className="block sm:hidden mr-auto">
      <UserListingsMobileFilter />
    </div>
    <SelectButton selecting={false} onClick={() => {}} total={0} className="ml-auto sm:ml-0" onRemove={() => {}} />
    <div className="flex items-center gap-3">
      <p className="hidden sm:block text-grey-600 text-xs">{totalCount} Lands</p>
      <Sort options={SortEnum} />
    </div>
  </div>
);

export default UserListingHeader;
