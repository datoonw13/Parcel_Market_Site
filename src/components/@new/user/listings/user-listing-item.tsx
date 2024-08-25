"use client";

import { FC } from "react";
import { LandListItemProps } from "@/types/lands";
import { useAtom } from "jotai";
import { userListingAtom } from "@/atoms/user-listing-atom";
import LandListItem from "../../lands/land-list-item/land-list-item";

const UserListingItem: FC<LandListItemProps> = (params) => {
  const { sellingItemId } = params;
  const [userListingOption, setUserListingOption] = useAtom(userListingAtom);

  console.log('aa');
  
  return (
    <LandListItem
      {...params}
      selecting={userListingOption.selecting}
      selected={userListingOption.selectedLandIds?.includes(sellingItemId)}
      onClick={() => {
        if (userListingOption.selecting) {
          const isSelected = userListingOption.selectedLandIds?.includes(sellingItemId);
          let selectedIds = [...(userListingOption.selectedLandIds || [])];
          if (isSelected) {
            selectedIds = selectedIds.filter((id) => id !== sellingItemId);
          } else {
            selectedIds = [...selectedIds, sellingItemId];
          }
          setUserListingOption((prev) => ({ ...prev, selectedLandIds: selectedIds }));
        }
      }}
    />
  );
};

export default UserListingItem;
