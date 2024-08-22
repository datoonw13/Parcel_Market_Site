"use client";

import { FC, useRef, useState } from "react";
import { Marker } from "leaflet";
import CalculationMap from "./calculation-map";
import LandPriceCalculationTable from "./calculation-table";

interface PropertyModel {
  id: string;
  latitude: number;
  longitude: number;
  parcelNumber: string;
  acreage: number;
}
interface TableWithMapProps {
  properties: Array<PropertyModel & { lastSalePrice: number; lastSaleDate: string; state: string; county: string }>;
  isUserSubscriptionTrial: boolean;
  sellingProperty: PropertyModel & { salePrice: number; coordinates: string; owner: string };
}

const TableWithMap: FC<TableWithMapProps> = ({ isUserSubscriptionTrial, properties, sellingProperty }) => {
  const markerRefs = useRef<{ [key: string]: Marker }>();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <CalculationMap
        sellingProperty={sellingProperty}
        properties={properties}
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
        data={properties}
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
