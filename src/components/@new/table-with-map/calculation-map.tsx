"use client";

import { formatParcelNumber, moneyFormatter } from "@/helpers/common";
import { Marker } from "leaflet";
import dynamic from "next/dynamic";
import { FC } from "react";

const Map = dynamic(() => import("@/components/shared/map/Map"), { ssr: false });

interface PropertyModel {
  latitude: number;
  longitude: number;
  parcelNumber: string;
  acreage: number;
}
interface CalculationMapProps {
  properties: Array<PropertyModel & { lastSalePrice: number; lastSaleDate: string }>;
  sellingProperty: PropertyModel & { salePrice: number; coordinates: string; owner: string };
  setMarkerRef: (parcelNumber: string, ref: Marker) => void;
  markerMouseEnter: (parcelNumber: string) => void;
  markerMouseLeave: (parcelNumber: string) => void;
  popupOpen: (parcelNumber: string) => void;
  popupClose: (parcelNumber: string) => void;
  highlightItemParcelNumber?: string | null;
}

const CalculationMap: FC<CalculationMapProps> = ({
  setMarkerRef,
  markerMouseEnter,
  markerMouseLeave,
  popupClose,
  popupOpen,
  properties,
  sellingProperty,
  highlightItemParcelNumber,
}) => {
  const mainLandSaleHistory = properties.filter(
    (property) => formatParcelNumber(property.parcelNumber) === formatParcelNumber(sellingProperty.parcelNumber)
  );

  const mapItems = [
    {
      parcelNumber: sellingProperty.parcelNumber,
      latitude: Number(sellingProperty.latitude),
      longitude: Number(sellingProperty.longitude),
      polygon: JSON.parse(sellingProperty.coordinates),
      markerType: "active" as const,
      center: true,
      popup: (
        <div className="flex flex-col gap-1 space-y-2">
          <p className="!p-0 !m-0">
            Owner: <b>{sellingProperty.owner}</b>
          </p>
          <p className="!p-0 !m-0">
            Acreage: <b>{sellingProperty.acreage}</b>
          </p>
          <p className="!p-0 !m-0">
            Price Per Acreage: <b>{moneyFormatter.format(sellingProperty.salePrice / sellingProperty.acreage)}</b>
          </p>
          {mainLandSaleHistory.length > 0 && (
            <div className="flex flex-col gap-1">
              <p className="!p-0 !m-0 !font-semibold">Sales History:</p>
              {mainLandSaleHistory.map((history) => (
                <div key={JSON.stringify(history)} className="!mb-1">
                  <p className="!p-0 !m-0">
                    Last Sale Date: <b>{history.lastSaleDate}</b>
                  </p>
                  <p className="!p-0 !m-0">
                    Last Sale Price Per Acre: <b>{moneyFormatter.format(history.lastSalePrice / history.acreage)}</b>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    ...properties
      .filter((property) =>
        mainLandSaleHistory.length > 0
          ? mainLandSaleHistory.find(
              (saleHistory) => formatParcelNumber(saleHistory.parcelNumber) !== formatParcelNumber(property.parcelNumber)
            )
          : true
      )
      .map((el) => ({
        ...el,
        popup: (
          <div className="flex flex-col gap-1">
            <p className="!p-0 !m-0">
              Parcel Number: <b>{el.parcelNumber}</b>
            </p>
            <p className="!p-0 !m-0">
              Acreage: <b>{el.acreage}</b>
            </p>
            <p className="!p-0 !m-0">
              Last Sale Date: <b>{el.lastSaleDate}</b>
            </p>
            <p className="!p-0 !m-0">
              Last Sale Price Per Acre: <b>{moneyFormatter.format(el.lastSalePrice / el.acreage)}</b>
            </p>
          </div>
        ),
      })),
  ];

  return (
    <div className="bg-primary-main-100 h-52 sm:h-60 md:h-96 lg:h-[448px] rounded-2xl [&>div]:rounded-2xl">
      <Map
        markerMouseEnter={markerMouseEnter}
        markerMouseLeave={markerMouseLeave}
        popupOpen={popupOpen}
        popupClose={popupClose}
        setMarkerRef={setMarkerRef}
        zoom={10}
        properties={mapItems}
        highlightItemParcelNumber={highlightItemParcelNumber}
      />
    </div>
  );
};

export default CalculationMap;
