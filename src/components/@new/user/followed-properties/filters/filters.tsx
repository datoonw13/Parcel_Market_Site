"use client";

import { SortEnum } from "@/types/common";
import { IUserBaseInfo } from "@/types/auth";
import { FC, useEffect, useState } from "react";
import Sort from "@/components/@new/filters/sort";
import SelectButton from "@/components/@new/shared/forms/Button/SelectButton";
import { userPropertiesFiltersValidations } from "@/zod-validations/filters-validations";
import { z } from "zod";
import { useAtom } from "jotai";
import useNotification from "@/hooks/useNotification";
import { userFollowedPropertiesAtom } from "@/atoms/user-followed-properties-atom";
import { unFollowLandsAction } from "@/server-actions/follow/actions";
import ResponsiveWarningModal from "@/components/@new/shared/modals/ResponsiveWarningModal";
import UserFollowedPropertiesMobileFilters from "./mobile-filters";
import UserFollowedPropertiesDesktopFilters from "./desktop-filters";

type Filters = z.infer<typeof userPropertiesFiltersValidations>;

interface UserFollowerPropertiesFilterProps {
  selectedFilters: Filters;
  onChange: <T extends keyof Filters>(data: { [key in T]: Filters[T] }) => void;
  totalItems: number;
  user: IUserBaseInfo | null;
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
      } else {
        setOpenRemoveModal(false);
        setUserFollowedPropertiesOptions((prev) => {
          const listKey = prev.list && Object.keys(prev.list)[0];
          const listItems =
            listKey &&
            prev?.list?.[listKey].map((el) => ({
              ...el,
              followedListingId: prev.removeItemsIds?.includes(el?.id || -1) ? undefined : el.followedListingId,
            }));

          return {
            ...prev,
            selecting: false,
            removeItemsIds: null,
            list:
              listKey && listItems
                ? {
                    listKey: listItems,
                  }
                : null,
          };
        });
      }
      setPending(false);
    }
  };

  useEffect(
    () => () => {
      setUserFollowedPropertiesOptions({ selecting: false, removeItemsIds: null, list: null });
    },
    [setUserFollowedPropertiesOptions]
  );

  return (
    <>
      <ResponsiveWarningModal
        variant="error"
        open={openRemoveModal}
        okPending={pending}
        closeModal={() => {
          setOpenRemoveModal(false);
        }}
        onCancel={() => {
          setUserFollowedPropertiesOptions((prev) => ({ ...prev, selecting: false, selectedLandIds: null }));
          setOpenRemoveModal(false);
        }}
        title="Unfollow Selected Properties?"
        description="Are you sure you want to unfollow properties you selected?"
        onOK={onRemove}
        okLabel="Unfollow"
      />
      <div className="hidden lg:flex">
        {/* <UserFollowedPropertiesDesktopFilters onChange={onChange} selectedFilters={selectedFilters} disabled={!user?.isSubscribed} /> */}
      </div>
      <div className="flex items-center lg:justify-between gap-3">
        <div className="flex lg:hidden mr-auto">
          {/* <UserFollowedPropertiesMobileFilters disabled={!user?.isSubscribed} onChange={onChange} selectedFilters={selectedFilters} /> */}
        </div>
        <SelectButton
          selecting={userFollowedPropertiesOptions.selecting}
          onClick={() => setUserFollowedPropertiesOptions((prev) => ({ ...prev, selecting: !prev.selecting, selectedLandIds: null }))}
          total={userFollowedPropertiesOptions.removeItemsIds?.length}
          onRemove={() => setOpenRemoveModal(true)}
          allSelected={
            !!(
              userFollowedPropertiesOptions.list &&
              Object.values(userFollowedPropertiesOptions.list).flat().length === userFollowedPropertiesOptions.removeItemsIds?.length
            )
          }
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
