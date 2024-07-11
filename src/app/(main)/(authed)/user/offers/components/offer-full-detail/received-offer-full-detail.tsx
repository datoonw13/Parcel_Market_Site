import { LocationIcon1 } from "@/components/@new/icons/LocationIcons";
import { getCountyValue, getStateValue } from "@/helpers/states";
import { OfferModel } from "@/types/offer";
import { IdIcon1 } from "@/components/@new/icons/IdIcons";
import { ResizeIcon1 } from "@/components/@new/icons/ResizeIcons";
import { MoneyIcon1 } from "@/components/@new/icons/MoneyIcons";
import { numFormatter } from "@/helpers/common";
import Divider from "@/components/@new/shared/Divider";
import Button from "@/components/@new/shared/forms/Button";
import clsx from "clsx";
import OfferDetailSection from "../offer-detail-section";
import OfferFullDetailMap from "./offer-full-detail-map";

const OfferFullDetail = ({ data, responsive, actionClasses }: { data: OfferModel; responsive?: true; actionClasses?: string }) => (
  <div>
    <div className={clsx(responsive && "border border-grey-100 rounded-xl py-6 px-4")}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-3 sm:mb-4 md:mb-8">
        <div className="grid gap-2">
          <p className="font-semibold truncate">land in Los Angeles County, California, USA</p>
          <p className="flex items-center gap-1.5 text-grey-600 text-xs">
            <LocationIcon1 className="!w-3 !h-3.5" color="primary-main" />
            {getStateValue(data.sellingProperty.state)?.label};{" "}
            {getCountyValue(data.sellingProperty.county, data.sellingProperty.state)?.label}
          </p>
        </div>
        <div className="flex sm:flex-col justify-between items-center sm:items-end">
          <p className="text-xs font-medium">Offer Price</p>
          <p className="font-semibold text-base sm:text-lg md:text-2xl text-primary-main">{numFormatter.format(Number(data.price))}</p>
        </div>
      </div>
      <OfferFullDetailMap data={data.sellingProperty} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 sm:mb-4 md:mb-6">
        <div className="flex items-center gap-1.5">
          <IdIcon1 color="grey-600" />
          <p className="text-sm text-grey-600">
            Parcel ID: <span className="font-medium ml-0.5 text-black">{data.sellingProperty.parcelNumber}</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <ResizeIcon1 color="grey-600" />
          <p className="text-sm text-grey-600">
            Acreage: <span className="font-medium ml-0.5 text-black">{data.sellingProperty.acrage}</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <MoneyIcon1 color="grey-600" />
          <p className="text-sm text-grey-600">
            VOLT Value:{" "}
            <span className="font-medium ml-0.5 text-black">{numFormatter.format(Number(data.sellingProperty.marketPrice))}</span>
          </p>
        </div>
      </div>
      <OfferDetailSection alertClasses="mt-3 sm:mt-5" data={data} />
    </div>
    <Divider className="mt-6" />
    <div className={clsx("flex flex-col sm:flex-row gap-3 py-4", actionClasses)}>
      <Button variant="secondary" className="w-full sm:w-fit">
        Contact Buyer
      </Button>
      <div className={clsx("flex flex-col sm:flex-row gap-3 sm:ml-auto")}>
        <Button className="w-full sm:w-fit" color="error">
          Reject
        </Button>
        <Button className="w-full sm:w-fit">Accept</Button>
      </div>
    </div>
  </div>
);

export default OfferFullDetail;
