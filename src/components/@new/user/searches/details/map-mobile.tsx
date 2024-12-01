"use client";

import dynamic from "next/dynamic";
import { FC } from "react";

const Map = dynamic(() => import("@/components/shared/map/Map"), { ssr: false });

interface SearchItemDetailsMobileMapProps {
  propertiesUsedForCalculation: {
    parcelNumberNoFormatting: string;
    latitude: number;
    longitude: number;
  }[];
  sellingPropertyData: {
    parcelNumberNoFormatting: string;
    latitude: number;
    longitude: number;
  };
  highlightParcelNumber: string;
}

const SearchItemDetailsMobileMap: FC<SearchItemDetailsMobileMapProps> = ({
  propertiesUsedForCalculation,
  highlightParcelNumber,
  sellingPropertyData,
}) => {
  const mainLandSaleHistory = propertiesUsedForCalculation.filter(
    (el) => el.parcelNumberNoFormatting === sellingPropertyData.parcelNumberNoFormatting
  );

  const sellingProperty = {
    ...sellingPropertyData,
    parcelNumber: sellingPropertyData.parcelNumberNoFormatting,
    markerType: "active" as const,
  };

  let properties = propertiesUsedForCalculation?.map((el) => ({
    parcelNumber: el.parcelNumberNoFormatting,
    parcelNumberNoFormatting: el.parcelNumberNoFormatting,
    latitude: el.latitude,
    longitude: el.longitude,
    markerType: el.parcelNumberNoFormatting === highlightParcelNumber ? ("highlighted" as const) : ("default" as const),
    center: el.parcelNumberNoFormatting === highlightParcelNumber,
  }));

  if (mainLandSaleHistory.length > 0) {
    properties = properties.filter((el) => !mainLandSaleHistory.find((x) => el.parcelNumberNoFormatting === x.parcelNumberNoFormatting));
  }

  return <Map properties={[sellingProperty, ...properties]} zoom={10} dragging={false} disableZoom />;
};

export default SearchItemDetailsMobileMap;
