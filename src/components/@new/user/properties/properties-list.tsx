import { getAllStates } from "@/helpers/states";
import { moneyFormatter } from "@/helpers/common";
import { z } from "zod";
import { userPropertiesFiltersValidations } from "@/zod-validations/filters-validations";
import { getUserListingAction } from "@/server-actions/user-listings/actions";
import { UserIcon2 } from "../../icons/UserIcons";
import { IdIcon1 } from "../../icons/IdIcons";
import { ResizeIcon1 } from "../../icons/ResizeIcons";
import { MoneyIcon1 } from "../../icons/MoneyIcons";
import DataNotFound from "../../shared/DataNotFound";
import TablePagination from "../../shared/table-pagination";
import UserPropertiesListItem from "./listing-item";

const UserPropertiesList = async ({
  pageSize,
  totalItems,
  filters,
}: {
  pageSize: number;
  totalItems: number;
  filters: z.infer<typeof userPropertiesFiltersValidations>;
}) => {
  const { data } = await getUserListingAction(pageSize, filters);

  return (
    <div className="mt-6 md:mt-10">
      <div className="space-y-10 md:space-y-12">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {data?.list.map((land) => {
            const state = getAllStates({ filterBlackList: true }).find((el) => el.value === land.state.toLocaleLowerCase());
            const county = state?.counties?.find((el) => el.split(" ")[0].toLocaleLowerCase() === land.county.toLocaleLowerCase()) || "";
            return (
              <UserPropertiesListItem
                className="max-w-2xl m-auto"
                key={land.id}
                sellingItemId={land.id}
                view="vertical"
                data={{
                  receivedOffers: land?.offers.length,
                  availableTill: land.availableTill,
                  state: state?.label || "",
                  county: county || "",
                  name: land.title,
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
                      value: moneyFormatter.format(Number(land.salePrice)),
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
            currentPage={filters.page ? Number(filters.page) - 1 : 0}
          />
        )}
        {totalItems === 0 && <DataNotFound message="No listings yet..." />}
        {totalItems > 0 && data && data.list.length === 0 && <DataNotFound message="Listings not found..." />}
      </div>
    </div>
  );
};

export default UserPropertiesList;
