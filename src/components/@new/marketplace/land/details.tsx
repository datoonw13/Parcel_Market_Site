import { moneyFormatter } from "@/helpers/common";
import { getUserAction } from "@/server-actions/user/actions";
import { SellingPropertyDetails } from "@/types/property";
import Link from "next/link";
import routes from "@/helpers/routes";
import LandFollowButton from "../../lands/land-follow-button";
import Button from "../../shared/forms/Button";
import MakeOfferButton from "./make-offer-button";

const LandDetails = async ({ data }: { data: SellingPropertyDetails }) => {
  const user = await getUserAction();

  const getSaleRangePerAcre = () => {
    const totalSum = data.usedForPriceCalculations!.reduce((acc, cur) => acc + Number(cur.lastSalesPrice) / Number(cur.arcage), 0);
    return moneyFormatter.format(totalSum / data.usedForPriceCalculations!.length);
  };

  return (
    <div className="rounded-2xl border border-grey-100">
      <div className="p-4 md:p-6 lg:p-8 space-y-4">
        <p className="text-lg font-semibold">Detail Information</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-1.5 md:gap-y-3 gap-x-6">
          <div className="space-y-1.5 md:space-y-3">
            <p className="text-grey-600">
              Owner: <span className="text-black">{data?.owner}</span>
            </p>
            <p className="text-grey-600">
              Parcel ID: <span className="text-black">{data.parcelNumber}</span>
            </p>
            <p className="text-grey-600">
              Acreage: <span className="text-black">{data.acrage}</span>
            </p>
          </div>
          <div className="space-y-1.5 md:space-y-3">
            <p className="text-grey-600">
              Property Type: <span className="text-black">{data.propertyType || "N/A"}</span>
            </p>
            <p className="text-grey-600">
              VOLT Value: <span className="text-black">{moneyFormatter.format(data.salePrice)}</span>
            </p>
            <p className="text-grey-600">
              Volt Value Per Acre:{" "}
              <span className="text-black">{moneyFormatter.format(Number((data.salePrice / data.acrage).toFixed(2)))}</span>
            </p>
          </div>
          <div className="space-y-1.5 md:space-y-3">
            <p className="text-grey-600">
              Sale Range Per Acre: <span className="text-black">{getSaleRangePerAcre()}</span>
            </p>
            <p className="text-grey-600">
              Price For Improvements:{" "}
              <span className="text-black">{data.improvmentsValue ? moneyFormatter.format(Number(data.improvmentsValue)) : "N/A"}</span>
            </p>
          </div>
        </div>
      </div>
      {data.user_id !== user?.id && (
        <div className="border-t border-t-grey-100 py-4 px-4 md:px-6 lg:px-8 flex flex-col sm:flex-row gap-3 sm:justify-between">
          <div className="[&>*>button]:w-full sm:[&>*>button]:w-fit">
            <LandFollowButton landId={data.id} initialFollowedListingId={data.followedListingId} />
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <Link href={`${routes.user.messages.fullUrl}?userId=${data.user_id}`}>
              <Button variant="secondary">Contact Seller</Button>
            </Link>
            {!data.offerId && <MakeOfferButton sellingPropertyId={data.id} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandDetails;
