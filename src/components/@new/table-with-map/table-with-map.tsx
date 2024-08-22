"use client";

import { FC, useRef, useState } from "react";
import { Marker } from "leaflet";
import { formatParcelNumber } from "@/helpers/common";
import CalculationMap from "./calculation-map";
import LandPriceCalculationTable from "./calculation-table";

interface PropertyModel {
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
  const [selectedItemParcelNumber, setSelectedItemParcelNumber] = useState<string | null>(null);
  const [hoveredItemParcelNumber, setHoveredItemParcelNumber] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <CalculationMap
        sellingProperty={sellingProperty}
        properties={properties}
        highlightItemParcelNumber={hoveredItemParcelNumber || selectedItemParcelNumber}
        setMarkerRef={(key, ref) => {
          markerRefs.current = { ...markerRefs.current, [key]: ref };
        }}
        markerMouseEnter={(id) => {
          setHoveredItemParcelNumber(id);
        }}
        markerMouseLeave={() => {
          setHoveredItemParcelNumber(null);
        }}
        popupOpen={(id) => {
          setSelectedItemParcelNumber(id);
          if (markerRefs.current) {
            markerRefs.current?.[id]?.openPopup();
          }
        }}
        popupClose={() => {
          setSelectedItemParcelNumber(null);
        }}
      />
      <LandPriceCalculationTable
        data={properties}
        onMouseEnter={(id) => {
          setHoveredItemParcelNumber(id);
        }}
        onMouseLeave={() => {
          setHoveredItemParcelNumber(null);
        }}
        isUserSubscriptionTrial={isUserSubscriptionTrial}
        selectedItemParcelNumber={selectedItemParcelNumber}
        hoveredItemParcelNumber={hoveredItemParcelNumber}
        onSelect={(parcelNumber) => {
          const property = properties.find((el) => formatParcelNumber(el.parcelNumber) === formatParcelNumber(parcelNumber));
          const isSellingLandHistory =
            property && formatParcelNumber(property.parcelNumber) === formatParcelNumber(sellingProperty.parcelNumber);
          setSelectedItemParcelNumber(parcelNumber);
          if (markerRefs.current) {
            markerRefs.current?.[isSellingLandHistory ? sellingProperty.parcelNumber : parcelNumber]?.openPopup();
          }
        }}
      />
    </div>
  );
};

export default TableWithMap;
