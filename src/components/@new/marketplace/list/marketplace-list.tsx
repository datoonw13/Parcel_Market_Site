import { getMarketplaceListAction } from "@/server-actions/marketplace/action";
import { getAllStates } from "@/helpers/states";
import { getUserAction } from "@/server-actions/user/actions";
import { numFormatter } from "@/helpers/common";
import { z } from "zod";
import { marketplaceFiltersValidations } from "@/zod-validations/filters-validations";
import LandListItem from "../../lands/land-list-item/land-list-item";
import { UserIcon2 } from "../../icons/UserIcons";
import { IdIcon1 } from "../../icons/IdIcons";
import { ResizeIcon1 } from "../../icons/ResizeIcons";
import { MoneyIcon1 } from "../../icons/MoneyIcons";
import DataNotFound from "../../shared/DataNotFound";
import TablePagination from "../../shared/table-pagination";

const MarketplaceList = async ({
  pageSize,
  totalCount,
  searchParams,
}: {
  pageSize: number;
  totalCount: number;
  searchParams: z.infer<typeof marketplaceFiltersValidations>;
}) => {
  const filters = await marketplaceFiltersValidations.safeParseAsync(searchParams);
  const { data } = await getMarketplaceListAction(pageSize, filters.data!);
  const user = await getUserAction();

  return (
    <div className="mt-6 md:mt-10">
      <div className="space-y-10 md:space-y-12">
        <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2">
          {data?.list.map((land) => {
            const state = getAllStates({ filterBlackList: true }).find((el) => el.value === land.state.toLocaleLowerCase());
            const county = state?.counties?.find((el) => el.split(" ")[0].toLocaleLowerCase() === land.county.toLocaleLowerCase()) || "";
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
                  id: land.id.toString(),
                  latitude: Number(land.lat),
                  longitude: Number(land.lon),
                  parcelNumber: land.parcelNumber
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
        {data?.pagination && data.pagination.totalCount > 0 && (
          <TablePagination
            rowsPerPage={pageSize}
            totalCount={data?.pagination.totalCount}
            currentPage={filters.data?.page ? Number(filters.data?.page) - 1 : 0}
          />
        )}
        {totalCount === 0 && <DataNotFound message="There is no land added yet..." />}
        {totalCount > 0 && data && data.list.length === 0 && <DataNotFound message="Lands not found..." />}
      </div>
    </div>
  );
};

export default MarketplaceList;
