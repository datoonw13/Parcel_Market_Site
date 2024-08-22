import { FC } from "react";
import TableWithMap from "../../table-with-map/table-with-map";

interface PropertyModel {
  id: string;
  latitude: number;
  longitude: number;
  parcelNumber: string;
  acreage: number;
}
interface RecentSalesListProps {
  properties: Array<PropertyModel & { lastSalePrice: number; lastSaleDate: string; state: string; county: string }>;
  isUserSubscriptionTrial: boolean;
  sellingProperty: PropertyModel & { salePrice: number; coordinates: string; owner: string };
}
const RecentSalesList: FC<RecentSalesListProps> = ({ properties, isUserSubscriptionTrial, sellingProperty }) => (
  <div className="space-y-6">
    <div className="space-y-3">
      <h1 className="text-center font-semibold text-lg md:text-xl lg:text-2xl">Recent Sales List</h1>
      <h2 className="text-center text-grey-800 text-sm">
        Below are recent sales used by VOLT for similar acreage within 10 miles and over the past 2 years.
      </h2>
    </div>
    <TableWithMap
      sellingProperty={sellingProperty}
      properties={properties.map((el) => ({ ...el, acreage: Number(el.acreage) }))}
      isUserSubscriptionTrial={isUserSubscriptionTrial}
    />
  </div>
);

export default RecentSalesList;
