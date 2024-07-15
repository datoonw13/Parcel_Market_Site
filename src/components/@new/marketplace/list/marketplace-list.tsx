import { getMarketplaceListAction } from "@/server-actions/marketplace/action";
import { numFormatter } from "@/helpers/common";
import { getAllStates } from "@/helpers/states";
import MarketPlacePagination from "./marketplace-pagination";
import MarketPlaceListItem from "./marketplace-list-item";
import { UserIcon2 } from "../../icons/UserIcons";
import { IdIcon1 } from "../../icons/IdIcons";
import { ResizeIcon1 } from "../../icons/ResizeIcons";
import { MoneyIcon1 } from "../../icons/MoneyIcons";
import DataNotFound from "../../shared/DataNotFound";

const MarketplaceList = async ({ params }: { params: { [key: string]: string } }) => {
  const { data } = await getMarketplaceListAction(params);
  
  return (
    <div className="space-y-10 md:space-y-12 mb-32">
      {data && data?.pagination?.totalCount > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2">
            {data?.list.map((land) => {
              const state = getAllStates({ filterBlackList: true }).find((el) => el.value === land.state.toLocaleLowerCase());
              const county = state?.counties?.find((el) => el.split(" ")[0].toLocaleLowerCase() === land.county.toLocaleLowerCase()) || "";
              return (
                <MarketPlaceListItem
                  className="max-w-md md:max-w-full m-auto"
                  key={land.id}
                  sellingItemId={land.id}
                  view="vertical"
                  showBookmark
                  followedListingId={land.followedListingId}
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
