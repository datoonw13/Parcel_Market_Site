"use client";

import { FC, useRef, useState } from "react";
import { Marker } from "leaflet";
import { formatParcelNumber } from "@/helpers/common";
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
  const markerRefs = useRef<{ [id: string]: Marker }>();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <CalculationMap
        sellingProperty={sellingProperty}
        properties={properties}
        highlightItemId={hoveredItemId || selectedItemId}
        setMarkerRef={(key, ref) => {
          markerRefs.current = { ...markerRefs.current, [key]: ref };
        }}
        markerMouseEnter={(id) => {
          setHoveredItemId(id);
        }}
        markerMouseLeave={() => {
          setHoveredItemId(null);
        }}
        popupOpen={(id) => {
          setSelectedItemId(id);
          if (markerRefs.current) {
            markerRefs.current?.[id]?.openPopup();
          }
        }}
        popupClose={() => {
          setSelectedItemId(null);
        }}
      />
      <LandPriceCalculationTable
        data={properties}
        onMouseEnter={(id) => {
          setHoveredItemId(id);
        }}
        onMouseLeave={() => {
          setHoveredItemId(null);
        }}
        isUserSubscriptionTrial={isUserSubscriptionTrial}
        selectedItemId={selectedItemId}
        hoveredItemId={hoveredItemId}
        onSelect={(id) => {
          const property = properties.find((el) => el.id === id);
          const isSellingLandHistory =
            property && formatParcelNumber(property.parcelNumber) === formatParcelNumber(sellingProperty.parcelNumber);
          setSelectedItemId(id);
          if (markerRefs.current) {
            markerRefs.current?.[isSellingLandHistory ? sellingProperty.id : id]?.openPopup();
          }
        }}
      />
    </div>
  );
};

export default TableWithMap;
