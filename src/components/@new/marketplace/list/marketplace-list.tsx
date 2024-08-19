import { getMarketplaceListAction } from "@/server-actions/marketplace/action";
import { numFormatter } from "@/helpers/common";
import { getAllStates } from "@/helpers/states";
import { getUserAction } from "@/server-actions/user/actions";
import MarketPlacePagination from "./marketplace-pagination";
import MarketPlaceListItem from "./marketplace-list-item";
import { UserIcon2 } from "../../icons/UserIcons";
import { IdIcon1 } from "../../icons/IdIcons";
import { ResizeIcon1 } from "../../icons/ResizeIcons";
import { MoneyIcon1 } from "../../icons/MoneyIcons";
import DataNotFound from "../../shared/DataNotFound";

const MarketplaceList = async ({ params }: { params: { [key: string]: string } }) => {
  const { data } = await getMarketplaceListAction(params);
  const user = await getUserAction();

  return (
    <div className="space-y-10 md:space-y-12">
      {data && data?.pagination?.totalCount > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2">
            {data?.list.map((land) => {
              const state = getAllStates({ filterBlackList: true }).find((el) => el.value === land.state.toLocaleLowerCase());
              const county = state?.counties?.find((el) => el.split(" ")[0].toLocaleLowerCase() === land.county.toLocaleLowerCase()) || "";
              return (
                <MarketPlaceListItem
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
          {data?.pagination && <MarketPlacePagination totalCount={data?.pagination.totalCount} />}
        </>
      ) : (
        <DataNotFound message="Data not fund..." />
      )}
    </div>
  );
};

export default MarketplaceList;
