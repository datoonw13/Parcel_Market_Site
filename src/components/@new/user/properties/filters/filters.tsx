"use client";

import { SortEnum } from "@/types/common";
import { IUserBaseInfo } from "@/types/auth";
import { FC, useEffect, useState } from "react";
import Sort from "@/components/@new/filters/sort";
import SelectButton from "@/components/@new/shared/forms/Button/SelectButton";
import { userPropertiesFiltersValidations } from "@/zod-validations/filters-validations";
import { z } from "zod";
import { useAtom } from "jotai";
import { removeUserListingItemsAction } from "@/server-actions/user-listings/actions";
import useNotification from "@/hooks/useNotification";
import ResponsiveRemoveModal from "@/components/@new/shared/modals/ResponsiveRemoveModal";
import { userPropertiesAtom } from "@/atoms/user-properties-atom";
import MarketplaceMobileFilters from "./mobile-filters";
import MarketplaceDesktopFilters from "./desktop-filters";

type Filters = z.infer<typeof userPropertiesFiltersValidations>;

interface UserPropertiesFiltersProps {
  selectedFilters: Filters;
  onChange: <T extends keyof Filters>(data: { [key in T]: Filters[T] }) => void;
  totalItems: number;
  user: IUserBaseInfo | null;
}
const UserPropertiesFilters: FC<UserPropertiesFiltersProps> = ({ totalItems, user, selectedFilters, onChange }) => {
  const { notify } = useNotification();
  const [userPropertiesOptions, setUserPropertiesOptions] = useAtom(userPropertiesAtom);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const [pending, setPending] = useState(false);

  const onRemove = async () => {
    if (userPropertiesOptions.removeItemsIds) {
      setPending(true);
      const { errorMessage } = await removeUserListingItemsAction(userPropertiesOptions.removeItemsIds);

      if (errorMessage) {
        notify({ title: errorMessage }, { variant: "error" });
        setPending(false);
      } else {
        setOpenRemoveModal(false);
        setUserPropertiesOptions({ selecting: false, removeItemsIds: null });
      }
    }
  };

  useEffect(
    () => () => {
      setUserPropertiesOptions({ selecting: false, removeItemsIds: null });
    },
    []
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
          setUserPropertiesOptions((prev) => ({ ...prev, selecting: false, selectedLandIds: null }));
          setOpenRemoveModal(false);
        }}
        title="Delete Selected Listings?"
        desc="Are you sure you want to delete listings you selected?"
        onOk={onRemove}
      />
      <div className="hidden lg:flex">
        <MarketplaceDesktopFilters onChange={onChange} selectedFilters={selectedFilters} disabled={!user?.isSubscribed} />
      </div>
      <div className="flex items-center lg:justify-between gap-3">
        <div className="flex lg:hidden mr-auto">
          <MarketplaceMobileFilters disabled={!user?.isSubscribed} onChange={onChange} selectedFilters={selectedFilters} />
        </div>
        <SelectButton
          selecting={userPropertiesOptions.selecting}
          onClick={() => setUserPropertiesOptions((prev) => ({ ...prev, selecting: !prev.selecting, selectedLandIds: null }))}
          total={userPropertiesOptions.removeItemsIds?.length}
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

export default UserPropertiesFilters;
