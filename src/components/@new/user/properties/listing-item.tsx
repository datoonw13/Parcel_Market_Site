"use client";

import { FC } from "react";
import { LandListItemProps } from "@/types/lands";
import { useAtom } from "jotai";
import LandListItem from "../../lands/land-list-item/land-list-item";
import { userPropertiesAtom } from "@/atoms/user-properties-atom";

const UserPropertiesListItem: FC<LandListItemProps> = (params) => {
  const { sellingItemId } = params;
  const [userPropertiesOptions, setUserPropertiesOptions] = useAtom(userPropertiesAtom);

  return (
    <LandListItem
      {...params}
      selecting={userPropertiesOptions.selecting}
      selected={userPropertiesOptions.removeItemsIds?.includes(sellingItemId)}
      onClick={() => {
        if (userPropertiesOptions.selecting) {
          const isSelected = userPropertiesOptions.removeItemsIds?.includes(sellingItemId);
          let selectedIds = [...(userPropertiesOptions.removeItemsIds || [])];
          if (isSelected) {
            selectedIds = selectedIds.filter((id) => id !== sellingItemId);
          } else {
            selectedIds = [...selectedIds, sellingItemId];
          }
          setUserPropertiesOptions((prev) => ({ ...prev, removeItemsIds: selectedIds }));
        }
      }}
    />
  );
};

export default UserPropertiesListItem;
