import { ISellingProperty } from "@/types/find-property";
import { numFormatter } from "@/helpers/common";
import { getUserAction } from "@/server-actions/user/actions";
import LandFollowButton from "../../lands/land-follow-button";
import Button from "../../shared/forms/Button";
import MakeOfferButton from "./make-offer-button";

const LandDetails = async ({ data }: { data: ISellingProperty }) => {
  const user = await getUserAction();

  return (
    <div className="rounded-2xl border border-grey-100">
      <div className="p-4 md:p-6 lg:p-8 space-y-4">
        <p className="text-lg font-semibold">Detail Information</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-1.5 md:gap-y-3 gap-x-6">
          <p className="text-grey-600">
            Owner: <span className="text-black">{data?.owner}</span>
          </p>
          <p className="text-grey-600">
            Property Type: <span className="text-black">{data.propertyType || "N/A"}</span>
          </p>
          <p className="text-grey-600">
            Sale Range Per Acre: <span className="text-black">??</span>
          </p>
          <p className="text-grey-600">
            Parcel ID: <span className="text-black">{data.parcelNumber}</span>
          </p>
          <p className="text-grey-600">
            VOLT Value: <span className="text-black">{numFormatter.format(data.salePrice)}</span>
          </p>
          <p className="text-grey-600">
            Price For Improvements:{" "}
            <span className="text-black">{data.improvmentsValue ? numFormatter.format(Number(data.improvmentsValue)) : "N/A"}</span>
          </p>
          <p className="text-grey-600">
            Acreage: <span className="text-black">{data.acrage}</span>
          </p>
          <p className="text-grey-600">
            Volt Value Per Acre:{" "}
            <span className="text-black">{numFormatter.format(Number((data.salePrice / data.acrage).toFixed(2)))}</span>
          </p>
        </div>
      </div>
      {data.user_id !== user?.id && (
        <div className="border-t border-t-grey-100 py-4 px-4 md:px-6 lg:px-8 flex flex-col sm:flex-row gap-3 sm:justify-between">
          <LandFollowButton landId={data.id} initialFollowedListingId={data.followedListingId} />
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <Button variant="secondary">Contact Seller</Button>
            {!data.offerId && <MakeOfferButton sellingPropertyId={data.id} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandDetails;
