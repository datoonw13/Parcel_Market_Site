"use client";

import { IPagination } from "@/types/common";
import React, { FC, useEffect } from "react";
import { getAllStates } from "@/helpers/states";
import { numFormatter } from "@/helpers/common";
import { useAtom } from "jotai";
import { followedListingsAtom } from "@/atoms/followed-listings-atom";
import { SellingPropertyDetails } from "@/types/property";
import DataNotFound from "../../shared/DataNotFound";
import UserListingHeader from "../listings/user-listing-header";
import UserListingItem from "../listings/user-listing-item";
import { UserIcon2 } from "../../icons/UserIcons";
import { IdIcon1 } from "../../icons/IdIcons";
import { ResizeIcon1 } from "../../icons/ResizeIcons";
import { MoneyIcon1 } from "../../icons/MoneyIcons";
import UserListingPagination from "../listings/user-listing-pagination";

interface FollowedListingsWrapperProps {
  data:
    | ({
        list: SellingPropertyDetails[];
      } & IPagination)
    | null;
  searchParams: { [key: string]: string };
}
const FollowedListingsWrapper: FC<FollowedListingsWrapperProps> = ({ data, searchParams }) => {
  const [followedListingsOptions, setFollowedListingsOptions] = useAtom(followedListingsAtom);

  useEffect(() => {
    if (JSON.stringify(searchParams) !== followedListingsOptions.key) {
      setFollowedListingsOptions({
        key: JSON.stringify(searchParams),
        data: data?.list || null,
      });
    }
  }, [data?.list, followedListingsOptions.key, searchParams, setFollowedListingsOptions]);

  useEffect(
    () => () => {
      setFollowedListingsOptions({
        key: null,
        data: null,
      });
    },
    [setFollowedListingsOptions]
  );

  return (
    <div>
      <div className="space-y-8 md:space-y-6">
        {!data || data.pagination.totalCount === 0 ? (
          <DataNotFound message="You have not saved any properties yet" />
        ) : (
          <>
            <UserListingHeader totalCount={data.pagination.totalCount} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {followedListingsOptions.data?.map((land) => {
                const state = getAllStates({ filterBlackList: true }).find((el) => el.value === land.state.toLocaleLowerCase());
                const county =
                  state?.counties?.find((el) => el.split(" ")[0].toLocaleLowerCase() === land.county.toLocaleLowerCase()) || "";
                return (
                  <UserListingItem
                    showBookmark
                    className="max-w-2xl m-auto"
                    key={land.id}
                    sellingItemId={land.id}
                    followedListingId={land.followedListingId}
                    view="vertical"
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
                          value: numFormatter.format(Number(land.salePrice)).toString(),
                        },
                      },
                    }}
                  />
                );
              })}
            </div>
            <UserListingPagination totalCount={data.pagination.totalCount} />
          </>
        )}
      </div>
    </div>
  );
};

export default FollowedListingsWrapper;
