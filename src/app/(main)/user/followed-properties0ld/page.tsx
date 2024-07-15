"use client";

import { UserIcon2 } from "@/components/@new/icons/UserIcons";
// import LandBox from "@/components/@new/lands/LandBox";
import LandsFilters from "@/components/@new/lands/filters/LandsFilters";
import Pagination from "@/components/@new/shared/Pagination";
import propertyApi, {
  propertyApiTags,
  useAddUserFollowedLandMutation,
  useGetUserFollowedLandsQuery,
  useRemoveUserFollowedLandsMutation,
} from "@/lib/features/apis/propertyApi";
import { getAllStates } from "@/helpers/states";
import { useEffect, useState } from "react";
import { ILandsFilters } from "@/types/lands";
import DataNotFound from "@/components/@new/shared/DataNotFound";
import { IdIcon1 } from "@/components/@new/icons/IdIcons";
import { ResizeIcon1 } from "@/components/@new/icons/ResizeIcons";
import { MoneyIcon1 } from "@/components/@new/icons/MoneyIcons";
import { numFormatter } from "@/helpers/common";
import ResponsiveRemoveModal from "@/components/@new/shared/modals/ResponsiveRemoveModal";
import { useAppDispatch } from "@/lib/hooks";
import UserFollowedPropertiesLoading from "./loading";

const removeNullValue = (obj: { [key: string]: any }) =>
  Object.keys(obj).reduce((acc, cur) => ({ ...acc, ...(obj[cur] && { [cur]: obj[cur] }) }), {});

const UserFollowedProperties = () => {
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState<ILandsFilters>({
    state: null,
    county: null,
    acreageMax: null,
    acreageMin: null,
    page: 1,
    pageSize: 10,
    priceMax: null,
    priceMin: null,
    sortBy: null,
  });
  const [select, setSelect] = useState<{
    selecting: boolean;
    selectedIds: number[];
    removeModal: boolean;
  }>({
    selecting: false,
    selectedIds: [],
    removeModal: false,
  });
  const { data, isFetching } = useGetUserFollowedLandsQuery(removeNullValue(filters));
  const [remove, { isLoading: removeLoading }] = useRemoveUserFollowedLandsMutation();
  const [setFollowed, { isLoading: setFollowedLoading }] = useAddUserFollowedLandMutation();
  const [removedLandsIds, setRemoveLandsIds] = useState<number[]>([]);

  const handleRemove = async () => {
    try {
      await remove(select.selectedIds).unwrap();
      setSelect({ selecting: false, selectedIds: [], removeModal: false });
      setRemoveLandsIds([...removedLandsIds, ...select.selectedIds]);
    } catch (error) {}
  };

  const toggleFollow = async (followedListingId: number, sellingProperty: number) => {
    try {
      if (removedLandsIds.includes(followedListingId)) {
        await setFollowed(sellingProperty).unwrap();
        setRemoveLandsIds(removedLandsIds.filter((el) => el !== followedListingId));
      } else {
        await remove([followedListingId]).unwrap();
        setRemoveLandsIds([...removedLandsIds, followedListingId]);
      }
    } catch (error) {}
  };

  useEffect(
    () => () => {
      dispatch(propertyApi.util.invalidateTags([propertyApiTags.userFollowedListings]));
    },
    [dispatch]
  );

  return (
    <>
      <ResponsiveRemoveModal
        open={select.removeModal}
        pending={removeLoading}
        handleClose={() => {
          setSelect({ selecting: false, selectedIds: [], removeModal: false });
        }}
        onReject={() => {
          setSelect({ selecting: false, selectedIds: [], removeModal: false });
        }}
        title="Delete Selected Listings?"
        desc="Are you sure you want to delete selected listings?"
        onOk={handleRemove}
      />
      <div className="w-full">
        <div className="mb-8">
          <h1 className="font-semibold text-2xl xs:mb-3 md:mb-4">My Saved Properties</h1>
          <h2 className="font-medium text-sm text-grey-800">
            View and manage the properties you&apos;ve bookmarked for future consideration.
          </h2>
        </div>
        <LandsFilters
          filters={filters}
          setFilters={setFilters}
          select={{
            startSelect: () => setSelect({ ...select, selecting: !select.selecting, selectedIds: [] }),
            totalSelected: select.selectedIds.length,
            onRemove: () => setSelect({ ...select, removeModal: true }),
            selecting: select.selecting,
          }}
          totalCount={data?.data.pagination.totalCount}
        />
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {!isFetching &&
            data?.data?.data?.map(({ sellingProperty, followedListingId }) => {
              const state = getAllStates({ filterBlackList: true }).find((el) => el.value === sellingProperty.state.toLocaleLowerCase());
              const county =
                state?.counties?.find((el) => el.split(" ")[0].toLocaleLowerCase() === sellingProperty.county.toLocaleLowerCase()) || "";
              return (
                <LandBox
                  sellingItemId={sellingProperty.id}
                  select={{
                    showSelect: select.selecting,
                    id: followedListingId,
                    onSelect: (id) => {
                      let newList = [...select.selectedIds];
                      if (select.selectedIds.includes(id)) {
                        newList = newList.filter((el) => el !== id);
                      } else {
                        newList.push(id);
                      }
                      setSelect({ ...select, selectedIds: newList });
                    },
                    selected: select.selectedIds.includes(followedListingId),
                  }}
                  parcelNumber={sellingProperty.parcelNumber}
                  data={{
                    availableTill: sellingProperty.availableTill,
                    state: state?.label || "",
                    county: county || "",
                    name: `${sellingProperty.acrage} - Acreages lands for sale...`,
                    options: {
                      owner: {
                        icon: <UserIcon2 className="w-4 h-4 " />,
                        label: "Owner",
                        value: sellingProperty.owner,
                      },
                      parcelNumber: {
                        icon: <IdIcon1 className="w-4 h-4 fill-grey-600" />,
                        label: "Parcel ID",
                        value: sellingProperty.parcelNumber,
                      },
                      acreage: {
                        icon: <ResizeIcon1 className="w-4 h-4 fill-grey-600" />,
                        label: "Acreage",
                        value: sellingProperty.acrage.toString(),
                      },
                      voltValue: {
                        icon: <MoneyIcon1 className="w-4 h-4 fill-grey-600" />,
                        label: "VOLT value",
                        value: numFormatter.format(Number(sellingProperty.marketPrice)).toString(),
                      },
                    },
                  }}
                  key={Math.random()}
                  view="vertical"
                  className="max-w-96 md:max-w-full m-auto"
                  follow={{
                    isFollowed: !!followedListingId && !removedLandsIds.includes(followedListingId),
                    showFollow: true,
                    followId: followedListingId,
                    toggle: (id) => toggleFollow(followedListingId, sellingProperty.id),
                  }}
                />
              );
            })}
        </div> */}
        {isFetching && <UserFollowedPropertiesLoading />}
        {!isFetching && data?.data.pagination.totalCount === 0 && <DataNotFound message="No followed listings" />}
        <Pagination
          rowsPerPage={filters.pageSize}
          totalCount={data?.data.pagination.totalCount ?? 0}
          className="mt-12"
          onChange={(page) => setFilters({ ...filters, page: page + 1 })}
        />
      </div>
    </>
  );
};

export default UserFollowedProperties;
