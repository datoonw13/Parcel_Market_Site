"use client";

import { ISellingProperty } from "@/types/find-property";
import { useRef, useState } from "react";
import { Map, Marker } from "leaflet";
import CalculationMap from "./calculation-map";
import LandPriceCalculationTable from "./calculation-table";

const TableWithMap = ({
  data,
  isUserSubscriptionTrial,
}: {
  data: NonNullable<ISellingProperty["usedForPriceCalculations"]>;
  isUserSubscriptionTrial: boolean;
}) => {
  const markerRefs = useRef<{ [key: string]: Marker }>();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <CalculationMap
        data={data.map((el) => ({
          ...el,
          active:
            hoveredItem === JSON.stringify([Number(el.latitude), Number(el.longitude)]) ||
            selectedItem === JSON.stringify([Number(el.latitude), Number(el.longitude)]),
        }))}
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
