"use client";

import { useRef, useState } from "react";
import { Map, Marker } from "leaflet";
import { UsedForPriceCalculationItem } from "@/types/property";
import CalculationMap from "./calculation-map";
import LandPriceCalculationTable from "./calculation-table";

const TableWithMap = ({
  data,
  isUserSubscriptionTrial,
  mainLandData,
}: {
  data: NonNullable<
    Array<
      Pick<
        UsedForPriceCalculationItem,
        "arcage" | "county" | "latitude" | "longitude" | "parcelNumber" | "lastSalesDate" | "lastSalesPrice"
      >
    >
  >;
  isUserSubscriptionTrial: boolean;
  mainLandData?: {
    coordinates: string;
    owner: string;
    parcelNumber: string;
    acreage: string;
    latitude: number;
    longitude: number;
    salePrice: number;
  };
}) => {
  const markerRefs = useRef<{ [key: string]: Marker }>();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <CalculationMap
        mainLandData={mainLandData}
        data={[
          ...data.map((el) => ({
            ...el,
            active:
              hoveredItem === JSON.stringify([Number(el.latitude), Number(el.longitude)]) ||
              selectedItem === JSON.stringify([Number(el.latitude), Number(el.longitude)]),
          })),
        ]}
        setMarkerRef={(key, ref) => {
          markerRefs.current = { ...markerRefs.current, [key]: ref };
        }}
        markerMouseEnter={(value) => {
          const key = JSON.stringify(value);
          setHoveredItem(key);
        }}
        markerMouseLeave={(value) => {
          setHoveredItem(null);
        }}
        popupOpen={(value) => {
          const key = JSON.stringify(value);
          setSelectedItem(key);
          if (markerRefs.current) {
            markerRefs.current?.[key]?.openPopup();
          }
        }}
        popupClose={() => {
          setSelectedItem(null);
        }}
      />
      <LandPriceCalculationTable
        data={data}
        onMouseEnter={(value) => {
          const key = JSON.stringify(value);
          setHoveredItem(key);
        }}
        onMouseLeave={(value) => {
          setHoveredItem(null);
        }}
        isUserSubscriptionTrial={isUserSubscriptionTrial}
        selectedItem={selectedItem}
        hoveredItem={hoveredItem}
        onSelect={(value) => {
          const key = JSON.stringify(value);
          setSelectedItem(key);
          if (markerRefs.current) {
            markerRefs.current?.[key]?.openPopup();
          }
        }}
      />
    </div>
  );
};

export default TableWithMap;
