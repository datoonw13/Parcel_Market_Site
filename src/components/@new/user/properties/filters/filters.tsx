"use client";

import { SortEnum } from "@/types/common";
import { IDecodedAccessToken } from "@/types/auth";
import { FC, useEffect, useRef, useState } from "react";
import TextField from "@/components/@new/shared/forms/text-field";
import { IoSearchOutline } from "react-icons/io5";
import { cn } from "@/helpers/common";
import { IMarketplaceFilters } from "@/types/lands";
import Sort from "@/components/@new/filters/sort";
import SelectButton from "@/components/@new/shared/forms/Button/SelectButton";
import MarketplaceDesktopFilters from "./desktop-filters";
import MarketplaceMobileFilters from "./mobile-filters";
import { userPropertiesFiltersValidations } from "@/zod-validations/filters-validations";
import { z } from "zod";
import { useAtom } from "jotai";
import { userListingAtom } from "@/atoms/user-listing-atom";
import { removeUserListingItemsAction } from "@/server-actions/user-listings/actions";
import useNotification from "@/hooks/useNotification";


type Filters = z.infer<typeof userPropertiesFiltersValidations>

interface UserPropertiesFiltersProps {
  selectedFilters: Filters;
  onChange: <T extends keyof Filters>(data: { [key in T]: Filters[T] }) => void;
  totalItems: number;
  user: IDecodedAccessToken | null;
}
const UserPropertiesFilters: FC<UserPropertiesFiltersProps> = ({ totalItems, user, selectedFilters, onChange }) => {
  const {notify} = useNotification()
  const [userListingOption, setUserListingOption] = useAtom(userListingAtom);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const [pending, setPending] = useState(false);


  const onRemove = async () => {
    if (userListingOption.selectedLandIds) {
      setPending(true);
      const { errorMessage } = await removeUserListingItemsAction(userListingOption.selectedLandIds)
      if (errorMessage) {
        notify({title: errorMessage}, {variant: 'error'})
        setPending(false);
      } else {
        setOpenRemoveModal(false);
        setUserListingOption((prev) => ({ ...prev, selecting: false, selectedLandIds: null }));
      }
    }
  };

  return (
    <>
      <div className="hidden lg:flex">
        <MarketplaceDesktopFilters onChange={onChange} selectedFilters={selectedFilters} disabled={!user?.isSubscribed} />
      </div>
      <div className="flex items-center lg:justify-between gap-3">
        <div className="flex lg:hidden mr-auto">
          <MarketplaceMobileFilters disabled={!user?.isSubscribed} onChange={onChange} selectedFilters={selectedFilters} />
        </div>
        <SelectButton
          selecting={userListingOption.selecting}
          onClick={() => setUserListingOption((prev) => ({ ...prev, selecting: !prev.selecting, selectedLandIds: null }))}
          total={userListingOption.selectedLandIds?.length}
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
