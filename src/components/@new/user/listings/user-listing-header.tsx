"use client";

import { SortEnum } from "@/types/common";
import { useAtom } from "jotai";
import { userListingAtom } from "@/atoms/user-listing-atom";
import { useState } from "react";
import { removeUserListingItemsAction, revalidateUserListings } from "@/server-actions/user-listings/actions";
import toast from "react-hot-toast";
import Sort from "../../shared/filters/Sort";
import SelectButton from "../../shared/forms/Button/SelectButton";
import UserListingsMobileFilter from "./user-listing-mobile-filters";
import ResponsiveRemoveModal from "../../shared/modals/ResponsiveRemoveModal";

const UserListingHeader = ({ totalCount }: { totalCount: number }) => {
  const [userListingOption, setUserListingOption] = useAtom(userListingAtom);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const [pending, setPending] = useState(false);

  const onRemove = async () => {
    if (userListingOption.selectedLandIds) {
      setPending(true);
      const { errorMessage } = await removeUserListingItemsAction(userListingOption.selectedLandIds);
      if (errorMessage) {
        toast.error(errorMessage);
        setPending(false);
      } else {
        setOpenRemoveModal(false);
        setUserListingOption((prev) => ({ ...prev, selecting: false, selectedLandIds: null }));
        await revalidateUserListings();
      }
    }
  };

  return (
    <>
      <ResponsiveRemoveModal
        open={openRemoveModal}
        pending={pending}
        handleClose={() => {
          setOpenRemoveModal(false);
        }}
        onReject={() => {
          setUserListingOption((prev) => ({ ...prev, selecting: false, selectedLandIds: null }));
          setOpenRemoveModal(false);
        }}
        title="Delete Selected Listings?"
        desc="Are you sure you want to delete listings you selected?"
        onOk={onRemove}
      />
      <div className="flex items-center gap-3 sm:justify-between sm:w-full">
        <div className="block sm:hidden mr-auto">
          <UserListingsMobileFilter />
        </div>
        <SelectButton
          selecting={userListingOption.selecting}
          onClick={() => setUserListingOption((prev) => ({ ...prev, selecting: !prev.selecting, selectedLandIds: null }))}
          total={userListingOption.selectedLandIds?.length}
          className="ml-auto sm:ml-0"
          onRemove={() => setOpenRemoveModal(true)}
        />
        <div className="flex items-center gap-3">
          <p className="hidden sm:block text-grey-600 text-xs">{totalCount} Lands</p>
          <Sort options={SortEnum} />
        </div>
      </div>
    </>
  );
};

export default UserListingHeader;
