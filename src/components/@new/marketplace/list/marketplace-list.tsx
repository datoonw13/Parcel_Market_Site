"use client";

import { numFormatter } from "@/helpers/common";
import { getAllStates } from "@/helpers/states";
import { IDecodedAccessToken } from "@/types/auth";
import { SellingPropertyDetails } from "@/types/property";
import { IPagination } from "@/types/common";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { IMarketplaceFilters } from "@/types/lands";
import { getMarketplaceListAction } from "@/server-actions/marketplace/action";
import { UserIcon2 } from "../../icons/UserIcons";
import { IdIcon1 } from "../../icons/IdIcons";
import { ResizeIcon1 } from "../../icons/ResizeIcons";
import { MoneyIcon1 } from "../../icons/MoneyIcons";
import Container from "../../shared/Container";
import SubscriptionAlert from "../../shared/subscription-alert";
import MarketplaceHeader from "./marketplace-header";
import MarketPlaceFilters from "./filters/marketplace-filters";
import TablePagination from "../../shared/table-pagination";
import DataNotFound from "../../shared/DataNotFound";
import LandListItem from "../../lands/land-list-item/land-list-item";

interface MarketplaceListProps {
  user: IDecodedAccessToken | null;
  initialData: ({ list: SellingPropertyDetails[] } & IPagination) | null;
  pageSize: number;
}

const initialFilters = {
  search: "",
  states: null,
  counties: null,
  acreageMin: null,
  acreageMax: null,
  page: 1,
  sortBy: null,
  voltValueMin: null,
  voltValueMax: null,
};

const MarketplaceList: FC<MarketplaceListProps> = ({ user, initialData, pageSize }) => {
  const [data, setData] = useState<MarketplaceListProps["initialData"]>(null);
  const isMounted = useRef(false);
  const [filters, setFilters] = useState<IMarketplaceFilters>(initialFilters);

  const refetchData = useCallback(async () => {
    const params = Object.keys(filters).reduce((acc, cur) => {
      if (filters[cur as keyof IMarketplaceFilters]) {
        return {
          ...acc,
          [cur]: filters[cur as keyof IMarketplaceFilters],
        };
      }
      return {
        ...acc,
      };
    }, {});

    setData(null);
    const req = await getMarketplaceListAction(pageSize, params);
    if (req.data) {
      setData(req.data);
    }
  }, [filters, pageSize]);

  useEffect(() => {
    if (isMounted.current) {
      refetchData();
    }
  }, [filters, refetchData]);

  useEffect(() => {
    isMounted.current = true;
  }, []);

  return (
    <Container className="py-6 md:py-8">
      <SubscriptionAlert user={user} />
      <div className="space-y-10 md:space-y-8">
        <MarketplaceHeader />
        <MarketPlaceFilters
          initialFilters={initialFilters}
          filters={filters}
          setFilters={setFilters}
          totalCount={initialData?.pagination.totalCount || 0}
          user={user}
        />
      </div>
      <div className="mt-6 md:mt-10">
        <div className="space-y-10 md:space-y-12">
          {!data ? (
            <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2 mt-6 md:mt-10">
              <div className="h-96 w-full animate-pulse bg-primary-main-100 max-w-md md:max-w-full m-auto rounded-2xl" />
              <div className="h-96 w-full animate-pulse bg-primary-main-100 max-w-md md:max-w-full m-auto rounded-2xl" />
              <div className="h-96 w-full animate-pulse bg-primary-main-100 max-w-md md:max-w-full m-auto rounded-2xl" />
              <div className="h-96 w-full animate-pulse bg-primary-main-100 max-w-md md:max-w-full m-auto rounded-2xl" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2">
                {data?.list.map((land) => {
                  const state = getAllStates({ filterBlackList: true }).find((el) => el.value === land.state.toLocaleLowerCase());
                  const county =
                    state?.counties?.find((el) => el.split(" ")[0].toLocaleLowerCase() === land.county.toLocaleLowerCase()) || "";
                  return (
                    <LandListItem
                      disableZoom
                      className="max-w-md md:max-w-full m-auto"
                      key={land.id}
                      sellingItemId={land.id}
                      disableDetail={!user?.isSubscribed}
                      view="vertical"
                      showBookmark={user?.isSubscribed}
                      followedListingId={land.followedListingId}
                      map={{
                        canView: user?.isSubscribed,
                        mainLandCoordinate: [Number(land.lat), Number(land.lon)],
                      }}
                      data={{
                        availableTill: land.availableTill,
                        state: state?.label || "",
                        county: county || "",
                        name: land.title,
                        options: {
                          owner: {
                            icon: <UserIcon2 className="w-4 h-4 " />,
                            label: "Owner",
                            value: user?.isSubscribed ? land.owner : "*********",
                          },
                          parcelNumber: {
                            icon: <IdIcon1 className="w-4 h-4 fill-grey-600" />,
                            label: "Parcel ID",
                            value: user?.planSelected ? land.parcelNumber : "*********",
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
              {data?.pagination && (
                <TablePagination
                  onChange={(page) => setFilters({ ...filters, page: page + 1 })}
                  rowsPerPage={pageSize}
                  totalCount={data?.pagination.totalCount}
                  currentPage={filters.page - 1}
                />
              )}
              {initialData?.pagination.totalCount === 0 && <DataNotFound message="There is no land added yet..." />}
              {initialData && initialData.pagination.totalCount > 0 && data && data.list.length === 0 && (
                <DataNotFound message="Lands not found..." />
              )}
            </>
          )}
        </div>
      </div>
    </Container>
  );
};

export default MarketplaceList;
