import { ISellingProperty } from "@/types/find-property";
import TableWithMap from "../../table-with-map/table-with-map";

const RecentSalesList = ({
  data,
  isUserSubscriptionTrial,
}: {
  data: NonNullable<ISellingProperty["usedForPriceCalculations"]>;
  isUserSubscriptionTrial: boolean;
}) => (
  <div className="space-y-6">
    <div className="space-y-3">
      <h1 className="text-center font-semibold text-lg md:text-xl lg:text-2xl">Recent Sales List</h1>
      <h2 className="text-center text-grey-800 text-sm">
        Below are recent sales used by VOLT for similar acreage within 10 miles and over the past 2 years.
      </h2>
    </div>
    <TableWithMap data={data} isUserSubscriptionTrial={isUserSubscriptionTrial} />
  </div>
);

export default RecentSalesList;
