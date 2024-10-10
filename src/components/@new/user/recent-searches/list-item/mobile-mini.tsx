import { Button } from "@/components/ui/button";
import { moneyFormatter } from "@/helpers/common";
import { IPropertyPolygon, IPropertyUsedForCalculation } from "@/types/property";
import moment from "moment";
import React, { FC } from "react";
import RecentSearchesMobileListItemMap from "./map";

interface RecentSearchesLitItemMobileMiniProps {
  data: {
    owner: string;
    parcelNumberNoFormatting: string;
    acreage: number;
    pricePerAcre: number;
    voltPrice: number;
    state: string;
    county: string;
    propertyType: string;
    searchDate: Date;
    lat: number;
    lon: number;
    polygon: IPropertyPolygon["polygon"];
  };
  propertiesUsedForCalculation: IPropertyUsedForCalculation[];
  onView: () => void;
}

const RecentSearchesLitItemMobileMini: FC<RecentSearchesLitItemMobileMiniProps> = ({ data, propertiesUsedForCalculation, onView }) => {
  const { acreage, county, owner, pricePerAcre, propertyType, searchDate, state, voltPrice, parcelNumberNoFormatting, lat, lon, polygon } =
    data;

  return (
    <div className="flex lg:hidden w-full flex-col gap-4">
      <div className="flex items-center justify-between gap-3 w-full border-b border-b-primary-main-200 pb-2">
        <div className="space-y-1">
          <p className="font-medium text-lg">{owner}</p>
          <p className="text-xs text-grey-600">Business owner</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-grey-600">Parcel Number:</p>
          <p className="font-medium text-sm">#{parcelNumberNoFormatting}</p>
        </div>
      </div>
      <ul className="grid grid-cols-3 gap-3">
        <li>
          <p className="text-xs text-grey-600">Acreage:</p>
          <p className="text-xs">{acreage.toFixed(2)}</p>
        </li>
        <li>
          <p className="text-xs text-grey-600">Per acre Price:</p>
          <p className="text-xs">{moneyFormatter.format(pricePerAcre)}</p>
        </li>
        <li>
          <p className="text-xs text-grey-600">Volt Value:</p>
          <p className="text-xs">{moneyFormatter.format(voltPrice)}</p>
        </li>
        <li>
          <p className="text-xs text-grey-600">State/county:</p>
          <p className="text-xs">
            {state}/{county}
          </p>
        </li>
        <li>
          <p className="text-xs text-grey-600">Property Type:</p>
          <p className="text-xs">{propertyType || "N/A"}</p>
        </li>
        <li>
          <p className="text-xs text-grey-600">Search date:</p>
          <p className="text-xs">{moment(searchDate).format("DD/DD/yyyy")}</p>
        </li>
      </ul>
      <div style={{ aspectRatio: "2/1" }} className="bg-primary-main-100 w-full max-h-80 rounded-lg [&>div]:rounded-lg">
        <RecentSearchesMobileListItemMap
          propertiesUsedForCalculation={propertiesUsedForCalculation.map(({ lat, lon, parcelNumberNoFormatting }) => ({
            latitude: lat,
            longitude: lon,
            parcelNumberNoFormatting,
          }))}
          sellingPropertyData={{
            latitude: data.lat,
            longitude: data.lon,
            parcelNumberNoFormatting: data.parcelNumberNoFormatting,
          }}
          highlightParcelNumber={data.parcelNumberNoFormatting}
        />
      </div>
      <Button className="h-9 w-full bg-primary-main/20 hover:bg-primary-main/30 text-primary-main" onClick={onView}>
        See More
      </Button>
    </div>
  );
};

export default RecentSearchesLitItemMobileMini;
