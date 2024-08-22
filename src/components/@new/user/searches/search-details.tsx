import { numFormatter } from "@/helpers/common";
import { getStateValue } from "@/helpers/states";
import moment from "moment";
import { getUserSubscriptions } from "@/server-actions/subscription/actions";
import { AuthedUserSearches } from "@/types/auth";
import { uuid } from "short-uuid";
import TableWithMap from "../../table-with-map/table-with-map";

const SearchDetails = async ({ data }: { data: AuthedUserSearches }) => {
  const userSubscription = await getUserSubscriptions();
  const isUserSubscriptionTrial = !!userSubscription.data?.find((el) => el.status === "trialing");

  return (
    <div className="space-y-3 pb-6">
      <ul className="list-disc marker:primary-main-400 px-4 grid grid-cols-1 md:grid-cols-2 xl:md:grid-cols-3 gap-y-3 gap-x-10 py-3">
        <li className="text-primary-main-400">
          <p className="truncate text-sm text-grey-600 font-medium">
            Owner: <span className="text-sm text-black font-medium">{data.owner}</span>
          </p>
        </li>
        <li className="text-primary-main-400">
          <p className="truncate text-sm text-grey-600 font-medium">
            Property Type: <span className="text-sm text-black font-medium">{data.propertyType}</span>
          </p>
        </li>
        <li className="text-primary-main-400">
          <p className="truncate text-sm text-grey-600 font-medium">
            Price per acreage:{" "}
            <span className="text-sm text-black font-medium">{numFormatter.format(Number(data.price) / Number(data.acrage))}</span>
          </p>
        </li>
        <li className="text-primary-main-400">
          <p className="text-sm text-grey-600 font-medium truncate">
            State/county:{" "}
            <span className="text-sm text-black font-medium">
              {" "}
              {getStateValue(data.state)?.label}, <span className="capitalize">{data.county}</span>
            </span>
          </p>
        </li>
        <li className="text-primary-main-400">
          <p className="truncate text-sm text-grey-600 font-medium">
            Acreage: <span className="text-sm text-black font-medium">{data.acrage}</span>
          </p>
        </li>
        <li className="text-primary-main-400">
          <p className="truncate text-sm text-grey-600 font-medium">
            Search date: <span className="text-sm text-black font-medium">{moment(data.dateCreated).format("MM/DD/YYYY")}</span>
          </p>
        </li>
        <li className="text-primary-main-400">
          <p className="truncate text-sm text-grey-600 font-medium">
            Parcel ID: <span className="text-sm text-black font-medium">{data.parcelNumber}</span>
          </p>
        </li>
        <li className="text-primary-main-400">
          <p className="truncate text-sm text-grey-600 font-medium">
            Volt Value: <span className="text-sm text-black font-medium">{numFormatter.format(Number(data.price))}</span>
          </p>
        </li>
      </ul>
      <TableWithMap
        sellingProperty={{
          id: `selling-property-${data.id}`,
          acreage: Number(data.acrage),
          coordinates: data.coordinates,
          latitude: Number(data.lat || 1),
          longitude: Number(data.lon || 1),
          owner: data.owner,
          parcelNumber: data.parcelNumber,
          salePrice: Number(data.price),
        }}
        isUserSubscriptionTrial={isUserSubscriptionTrial}
        properties={data.assessments.map((el) => ({
          acreage: Number(el.arcage),
          county: el.county || "",
          id: `properties-${uuid()}`,
          lastSaleDate: el.lastSalesDate,
          lastSalePrice: Number(el.lastSalesPrice),
          latitude: Number(el.latitude),
          longitude: Number(el.longitude),
          parcelNumber: el.parcelNumber,
          state: el.state || "",
        }))}
      />
    </div>
  );
};

export default SearchDetails;
