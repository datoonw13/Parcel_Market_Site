"use client";

import { ISellingProperty } from "@/types/find-property";
import { useRef, useState } from "react";
import { Map, Marker } from "leaflet";
import CalculationMap from "./calculation-map";
import LandPriceCalculationTable from "./calculation-table";

const RecentSalesList = ({ data }: { data: NonNullable<ISellingProperty["usedForPriceCalculations"]> }) => {
  const mapRef = useRef<Map>();
  const markerRefs = useRef<{ [key: string]: Marker }>();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-center font-semibold text-lg md:text-xl lg:text-2xl">Recent Sales List</h1>
        <h2 className="text-center text-grey-800 text-sm">
          Below are recent sales used by VOLT for similar acreage within 10 miles and over the past 2 years.
        </h2>
      </div>
      <CalculationMap
        data={data.map((el) => ({
          ...el,
          active:
            hoveredItem === JSON.stringify([Number(el.latitude), Number(el.longitude)]) ||
            selectedItem === JSON.stringify([Number(el.latitude), Number(el.longitude)]),
        }))}
        setMapRef={(ref) => {
          mapRef.current = ref;
        }}
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
          setSelectedItem(null)
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

export default RecentSalesList;
