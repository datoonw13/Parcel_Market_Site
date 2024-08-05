"use client";

import { SortEnum } from "@/types/common";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useUserSearchAtom } from "@/atoms/user-search-atom";
import Sort from "../../shared/filters/Sort";
import SelectButton from "../../shared/forms/Button/SelectButton";
import ResponsiveRemoveModal from "../../shared/modals/ResponsiveRemoveModal";
import SearchMobileFilters from "./search-mobile-filters";

const UserSearchHeader = ({ totalCount }: { totalCount: number }) => {
  const [userSearchAtom, setUserSearchAtom] = useAtom(useUserSearchAtom);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const [pending, setPending] = useState(false);

  const onRemove = async () => {
    if (userSearchAtom.selectedIds) {
      setPending(true);
      setPending(false);
      // setPending(true);
      // const { errorMessage } = followedListings
      //   ? await unFollowLands(userListingOption.selectedLandIds)
      //   : await removeUserListingItemsAction(userListingOption.selectedLandIds);
      // if (errorMessage) {
      //   toast.error(errorMessage);
      //   setPending(false);
      // } else {
      //   setOpenRemoveModal(false);
      //   setUserListingOption((prev) => ({ ...prev, selecting: false, selectedLandIds: null }));
      //   !followedListings && (await revalidateUserListings());
      // }
    }
  };

  useEffect(
    () => () => {
      setUserSearchAtom({ selecting: false, selectedIds: null });
    },
    [setUserSearchAtom]
  );

  return (
    <>
      <ResponsiveRemoveModal
        open={openRemoveModal}
        pending={pending}
        handleClose={() => {
          setOpenRemoveModal(false);
        }}
        onReject={() => {
          setUserSearchAtom((prev) => ({ ...prev, selecting: false, selectedIds: null }));
          setOpenRemoveModal(false);
        }}
        title="Delete Selected Searches?"
        desc="Are you sure you want to delete selected Searches?"
        onOk={onRemove}
      />
      <div className="flex items-center gap-3 sm:justify-between sm:w-full">
        <div className="block sm:hidden mr-auto">
          <SearchMobileFilters />
        </div>
        <SelectButton
          selecting={userSearchAtom.selecting}
          onClick={() => {
            setUserSearchAtom((prev) => ({ ...prev, selecting: !prev.selecting, selectedIds: null }));
          }}
          total={userSearchAtom.selectedIds?.length}
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

export default UserSearchHeader;
