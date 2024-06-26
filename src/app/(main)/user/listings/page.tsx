"use client";

import { IdIcon1 } from "@/components/@new/icons/IdIcons";
import { MoneyIcon1 } from "@/components/@new/icons/MoneyIcons";
import { ResizeIcon1 } from "@/components/@new/icons/ResizeIcons";
import { UserIcon2 } from "@/components/@new/icons/UserIcons";
import LandBox from "@/components/@new/lands/LandBox";
import LandsDesktopFilters from "@/components/@new/lands/filters/LandsDesktopFilters/LandsDesktopFilters";
import DataNotFound from "@/components/@new/shared/DataNotFound";
import { numFormatter } from "@/helpers/common";
import { getAllStates } from "@/helpers/states";
import { useGetUserSellingPropertiesQuery, useRemoveUserSellingLandMutation } from "@/lib/features/apis/propertyApi";
import { ILandsFilters } from "@/types/lands";
import { Container } from "@mui/material";
import React, { useState } from "react";
import Pagination from "@/components/@new/shared/Pagination";
import ResponsiveRemoveModal from "@/components/@new/shared/modals/ResponsiveRemoveModal";
import UserLandsListingLoading from "./loading";
import LandsFilters from "@/components/@new/lands/filters/LandsFilters";

const removeNullValue = (obj: { [key: string]: any }) =>
  Object.keys(obj).reduce((acc, cur) => ({ ...acc, ...(obj[cur] && { [cur]: obj[cur] }) }), {});

const UserListings = () => {
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
  const { data, isFetching } = useGetUserSellingPropertiesQuery(removeNullValue(filters));
  const [remove, { isLoading }] = useRemoveUserSellingLandMutation();

  const handleRemove = async () => {
    try {
      await remove(select.selectedIds).unwrap();
      setSelect({ selecting: false, selectedIds: [], removeModal: false });
    } catch (error) {}
  };

  return (
    <>
      <ResponsiveRemoveModal
        open={select.removeModal}
        pending={isLoading}
        handleClose={() => {
          setSelect({ selecting: false, selectedIds: [], removeModal: false });
        }}
        onCancel={() => {
          setSelect({ selecting: false, selectedIds: [], removeModal: false });
        }}
        title="Delete Selected Listings?"
        desc="Are you sure you want to delete listings you selected?"
        onDelete={handleRemove}
      />
      <div className="w-full">
        <div className="mb-8">
          <h1 className="font-semibold text-2xl xs:mb-3 md:mb-4">My Listings</h1>
          <h2 className="font-medium text-sm text-grey-800">
            Welcome to Parcel Market and thank You for being here. At Parcel Market, our goal is simple, to provide a FREE...
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {!isFetching &&
            data?.data.data.map((land) => {
              const state = getAllStates().find((el) => el.value === land.state.toLocaleLowerCase());
              const county = state?.counties?.find((el) => el.split(" ")[0].toLocaleLowerCase() === land.county.toLocaleLowerCase()) || "";
              return (
                <LandBox
                  select={{
                    showSelect: select.selecting,
                    id: land.id,
                    onSelect: (id) => {
                      let newList = [...select.selectedIds];
                      if (select.selectedIds.includes(id)) {
                        newList = newList.filter((el) => el !== id);
                      } else {
                        newList.push(id);
                      }
                      setSelect({ ...select, selectedIds: newList });
                    },
                    selected: select.selectedIds.includes(land.id),
                  }}
                  data={{
                    availableTill: land.availableTill,
                    state: state?.label || "",
                    county: county || "",
                    name: `${land.acrage} - Acreages lands for sale...`,
                    options: {
                      owner: {
                        icon: <UserIcon2 className="w-4 h-4 " />,
                        label: "Owner",
                        value: land.owner,
                      },
                      parcelNumber: {
                        icon: <IdIcon1 className="w-4 h-4 fill-grey-600" />,
                        label: "Parcel ID",
                        value: land.parcelNumber,
                      },
                      acreage: {
                        icon: <ResizeIcon1 className="w-4 h-4 fill-grey-600" />,
                        label: "Acreage",
                        value: land.acrage.toString(),
                      },
                      voltValue: {
                        icon: <MoneyIcon1 className="w-4 h-4 fill-grey-600" />,
                        label: "VOLT value",
                        value: numFormatter.format(Number(land.marketPrice)).toString(),
                      },
                    },
                  }}
                  key={Math.random()}
                  view="vertical"
                  className="max-w-96 md:max-w-full m-auto"
                  parcelNumber=""
                  sellingItemId={2}
                />
              );
            })}
        </div>
        {isFetching && <UserLandsListingLoading />}
        {!isFetching && data?.data.pagination.totalCount === 0 && <DataNotFound message="No listings yet" />}
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

export default UserListings;
