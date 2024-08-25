"use client";

import { SortEnum } from "@/types/common";
import { IDecodedAccessToken } from "@/types/auth";
import { FC, useEffect, useState } from "react";
import Sort from "@/components/@new/filters/sort";
import SelectButton from "@/components/@new/shared/forms/Button/SelectButton";
import { userPropertiesFiltersValidations } from "@/zod-validations/filters-validations";
import { z } from "zod";
import { useAtom } from "jotai";
import { removeUserListingItemsAction } from "@/server-actions/user-listings/actions";
import useNotification from "@/hooks/useNotification";
import ResponsiveRemoveModal from "@/components/@new/shared/modals/ResponsiveRemoveModal";
import { userFollowedPropertiesAtom } from "@/atoms/user-followed-properties-atom";
import { unFollowLandsAction } from "@/server-actions/follow/actions";
import UserFollowedPropertiesMobileFilters from "./mobile-filters";
import UserFollowedPropertiesDesktopFilters from "./desktop-filters";

type Filters = z.infer<typeof userPropertiesFiltersValidations>;

interface UserFollowerPropertiesFilterProps {
  selectedFilters: Filters;
  onChange: <T extends keyof Filters>(data: { [key in T]: Filters[T] }) => void;
  totalItems: number;
  user: IDecodedAccessToken | null;
}
const UserFollowerPropertiesFilter: FC<UserFollowerPropertiesFilterProps> = ({ totalItems, user, selectedFilters, onChange }) => {
  const { notify } = useNotification();
  const [userFollowedPropertiesOptions, setUserFollowedPropertiesOptions] = useAtom(userFollowedPropertiesAtom);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const [pending, setPending] = useState(false);

  const onRemove = async () => {
    if (userFollowedPropertiesOptions.removeItemsIds) {
      setPending(true);
      const { errorMessage } = await unFollowLandsAction(userFollowedPropertiesOptions.removeItemsIds);
      if (errorMessage) {
        notify({ title: errorMessage }, { variant: "error" });
        setPending(false);
      } else {
        setOpenRemoveModal(false);
        setUserFollowedPropertiesOptions({ selecting: false, removeItemsIds: null });
      }
    }
  };

  useEffect(
    () => () => {
      setUserFollowedPropertiesOptions({ selecting: false, removeItemsIds: null });
    },
    [setUserFollowedPropertiesOptions]
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
          setUserFollowedPropertiesOptions((prev) => ({ ...prev, selecting: false, selectedLandIds: null }));
          setOpenRemoveModal(false);
        }}
        title="Unfollow Selected Properties?"
        desc="Are you sure you want to unfollow properties you selected?"
        onOk={onRemove}
      />
      <div className="hidden lg:flex">
        <UserFollowedPropertiesDesktopFilters onChange={onChange} selectedFilters={selectedFilters} disabled={!user?.isSubscribed} />
      </div>
      <div className="flex items-center lg:justify-between gap-3">
        <div className="flex lg:hidden mr-auto">
          <UserFollowedPropertiesMobileFilters disabled={!user?.isSubscribed} onChange={onChange} selectedFilters={selectedFilters} />
        </div>
        <SelectButton
          selecting={userFollowedPropertiesOptions.selecting}
          onClick={() => setUserFollowedPropertiesOptions((prev) => ({ ...prev, selecting: !prev.selecting, selectedLandIds: null }))}
          total={userFollowedPropertiesOptions.removeItemsIds?.length}
          onRemove={() => setOpenRemoveModal(true)}
        />
        <div className="flex">
          <div className="flex items-center gap-3 justify-end min-w-max">
            <p className="text-grey-600 text-xs hidden lg:block">{totalItems} Properties</p>
            <Sort value={selectedFilters.sortBy} onChange={(sortBy: any) => onChange({ sortBy })} options={SortEnum} />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserFollowerPropertiesFilter;
