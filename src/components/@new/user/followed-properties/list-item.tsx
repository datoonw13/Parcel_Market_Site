"use client";

import { FC } from "react";
import { LandListItemProps } from "@/types/lands";
import { useAtom } from "jotai";
import { userFollowedPropertiesAtom } from "@/atoms/user-followed-properties-atom";
import LandListItem from "../../lands/land-list-item/land-list-item";

const UserFollowedPropertiesListItem: FC<LandListItemProps> = (params) => {
  const { sellingItemId } = params;
  const [userFollowedPropertiesOptions, setUserFollowedPropertiesOptions] = useAtom(userFollowedPropertiesAtom);

  return (
    <LandListItem
      {...params}
      selecting={userFollowedPropertiesOptions.selecting}
      selected={userFollowedPropertiesOptions.removeItemsIds?.includes(sellingItemId)}
      onClick={() => {
        if (userFollowedPropertiesOptions.selecting) {
          const isSelected = userFollowedPropertiesOptions.removeItemsIds?.includes(sellingItemId);
          let selectedIds = [...(userFollowedPropertiesOptions.removeItemsIds || [])];
          if (isSelected) {
            selectedIds = selectedIds.filter((id) => id !== sellingItemId);
          } else {
            selectedIds = [...selectedIds, sellingItemId];
          }
          setUserFollowedPropertiesOptions((prev) => ({ ...prev, removeItemsIds: selectedIds }));
        }
      }}
    />
  );
};

export default UserFollowedPropertiesListItem;
