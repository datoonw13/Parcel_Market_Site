import { Button } from "@/components/ui/button";
import { moneyFormatter } from "@/helpers/common";
import { IDecodedAccessToken } from "@/types/auth";
import { IPropertyPolygon, IPropertyUsedForCalculation } from "@/types/property";
import moment from "moment";
import dynamic from "next/dynamic";
import React, { FC } from "react";

const Map = dynamic(() => import("@/components/shared/map/Map"), { ssr: false });

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
  user: IDecodedAccessToken | null;
  onView: () => void;
}

const RecentSearchesLitItemMobileMini: FC<RecentSearchesLitItemMobileMiniProps> = ({
  data,
  propertiesUsedForCalculation,
  user,
  onView,
}) => {
  const { acreage, county, owner, pricePerAcre, propertyType, searchDate, state, voltPrice, parcelNumberNoFormatting, lat, lon, polygon } =
    data;

  // const mainLandSaleHistory = propertiesUsedForCalculation.filter((el) => el.parcelNumberNoFormatting === parcelNumberNoFormatting);
  const mainProperty = {
    parcelNumber: parcelNumberNoFormatting,
    parcelNumberNoFormatting,
    latitude: lat,
    longitude: lon,
    polygon,
    markerType: "active" as const,
    center: true,
    // popup: (
    //   <div className="flex flex-col gap-1 space-y-2">
    //     <p className="!p-0 !m-0">
    //       Owner: <b>{owner}</b>
    //     </p>
    //     <p className="!p-0 !m-0">
    //       Acreage: <b>{acreage.toFixed(2)}</b>
    //     </p>
    //     <p className="!p-0 !m-0">
    //       Price Per Acre: <b>{moneyFormatter.format(pricePerAcre)}</b>
    //     </p>
    //     {mainLandSaleHistory.length > 0 && (
    //       <div className="flex flex-col gap-1">
    //         <p className="!p-0 !m-0 !font-semibold">Sales History:</p>
    //         {mainLandSaleHistory.map((history) => (
    //           <div key={JSON.stringify(history)} className="!mb-1">
    //             <p className="!p-0 !m-0">
    //               Last Sale Date: <b>{moment(history.lastSaleDate).format("MM-DD-YYYY")}</b>
    //             </p>
    //             <p className="!p-0 !m-0">
    //               Last Sale Price Per Acre: <b>{moneyFormatter.format(history.pricePerAcreage)}</b>
    //             </p>
    //           </div>
    //         ))}
    //       </div>
    //     )}
    //   </div>
    // ),
  };

  const properties = propertiesUsedForCalculation?.map((el) => ({
    parcelNumber: el.parcelNumberNoFormatting,
    parcelNumberNoFormatting: el.parcelNumberNoFormatting,
    latitude: el.lat,
    longitude: el.lon,
    markerType: "default" as const,
    // ...(user &&
    //   user.isSubscribed && {
    //     popup: (
    //       <div className="flex flex-col gap-1 space-y-2">
    //         <p className="!p-0 !m-0">
    //           Parcel Number: <b>{el.parcelNumberNoFormatting}</b>
    //         </p>
    //         <p className="!p-0 !m-0">
    //           Acreage: <b>{el.acreage.toFixed(2)}</b>
    //         </p>
    //         <p className="!p-0 !m-0">
    //           Last Sale Date: <b>{moment(el.lastSaleDate).format("MM-DD-YYYY")}</b>
    //         </p>
    //         <p className="!p-0 !m-0">
    //           Last Sale Price Per Acre: <b>{moneyFormatter.format(el.pricePerAcreage)}</b>
    //         </p>
    //       </div>
    //     ),
    //   }),
  }));

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
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
        <Map properties={[mainProperty, ...properties]} zoom={9} dragging={false} disableZoom />
      </div>
      <Button className="h-9 w-full bg-primary-main/20 hover:bg-primary-main/30 text-primary-main" onClick={onView}>
        See More
      </Button>
    </div>
  );
};

export default RecentSearchesLitItemMobileMini;
