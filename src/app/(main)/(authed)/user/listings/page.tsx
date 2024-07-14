"use client";

import Sort from "@/components/@new/shared/filters/Sort";
import SelectButton from "@/components/@new/shared/forms/Button/SelectButton";
import UserProfileSectionHeader from "@/components/@new/user/UserProfileSectionHeader";
import UserListingsDesktopFilter from "@/components/@new/user/listings/user-listings-desktop-filters";
import UserListingsMobileFilter from "@/components/@new/user/listings/user-listings-mobile-filters";
import { SortEnum } from "@/types/common";
import { Suspense } from "react";

const removeNullValue = (obj: { [key: string]: any }) =>
  Object.keys(obj).reduce((acc, cur) => ({ ...acc, ...(obj[cur] && { [cur]: obj[cur] }) }), {});

const UserListings = () => {
  return (
    <>
      <div className="w-full">
        <UserProfileSectionHeader title="My Listings" description="Welcome to Parcel Market and thank You for being here. At Parcel Market, our goal is simple, to provide a FREE..." />
      <Suspense>
        <div className="hidden sm:block">
          <UserListingsDesktopFilter />
        </div>
      </Suspense>
        <div className="flex items-center gap-3 sm:justify-between sm:w-full">
          <div className="block sm:hidden mr-auto">
            <UserListingsMobileFilter />
          </div>
          <SelectButton
            selecting={false}
            onClick={() => {}}
            total={0}
            className="ml-auto sm:ml-0"
            onRemove={() => {}}
          />
          <div className="flex items-center gap-3">
            <p className="hidden sm:block text-grey-600 text-xs">1326,000 Lands</p>
            <Sort options={SortEnum} />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserListings;
