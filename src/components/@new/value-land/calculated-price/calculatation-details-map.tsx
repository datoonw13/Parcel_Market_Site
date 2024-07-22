"use client";

import { valueLandAtom } from "@/atoms/value-land-atom";
import { numFormatter } from "@/helpers/common";
import { ISignInResponse } from "@/types/auth";
import { useAtomValue } from "jotai";
import { LatLngTuple, Marker } from "leaflet";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

const Map = dynamic(() => import("@/components/shared/map/Map"), { ssr: false });

const CalculationDetailsMap = ({ user }: { user: ISignInResponse["payload"] | null }) => {
  const valueLandData = useAtomValue(valueLandAtom);
  const markerRefs = useRef<{ [key: string]: Marker }>();

  useEffect(() => {
    if (valueLandData.mapInteraction.hoveredLand && markerRefs.current) {
      markerRefs.current[valueLandData.mapInteraction.hoveredLand].openPopup();
    } else if (markerRefs.current) {
      Object.keys(markerRefs.current).forEach((key) => {
        markerRefs.current?.[key as keyof typeof markerRefs.current].closePopup();
      });
    }
  }, [valueLandData.mapInteraction.hoveredLand]);

  return (
    valueLandData.selectedLand &&
    valueLandData.calculatedPrice && (
      <Map
        setMarkerRef={(key, ref) => {
          markerRefs.current = { ...markerRefs.current, [key]: ref };
        }}
        geolibInputCoordinates={[
          [Number(valueLandData.selectedLand.properties.fields.lat), Number(valueLandData.selectedLand.properties.fields.lon)],
        ]}
        zoom={10}
        data={[
          {
            centerCoordinate: [
              Number(valueLandData.selectedLand.properties.fields.lat),
              Number(valueLandData.selectedLand.properties.fields.lon),
            ],
            active: true,
            parcelNumber: valueLandData.selectedLand.properties.fields.parcelnumb,
            polygon: valueLandData.selectedLand.geometry.coordinates,
            showMarker: true,
            popup: {
              owner: {
                label: "Owner",
                value: valueLandData.selectedLand.properties.fields.owner,
              },
              parcelNumber: {
                label: "Parcel Number",
                value: valueLandData.selectedLand.properties.fields.parcelnumb,
              },
              acreage: {
                label: "Acreage",
                value: valueLandData.selectedLand.properties.fields.ll_gisacre.toFixed(2),
              },
              showSelectButton: false,
            },
          },
          ...valueLandData.calculatedPrice.properties.map((el) => ({
            centerCoordinate: [Number(el.latitude), Number(el.longitude)] as LatLngTuple,
            parcelNumber: el.parselId,
            showMarker: true,
            ...(user && {
              popup: {
                parcelNumber: {
                  label: "Parcel Number",
                  value: el.parselId,
                },
                acreage: {
                  label: "Acreage",
                  value: el.arcage.toFixed(2),
                },
                lastSaleDate: {
                  label: "Last Sale Date",
                  value: el.lastSalesDate,
                },
                lastSalePrice: {
                  label: "Last Sale Price",
                  value: numFormatter.format(el.lastSalesPrice),
                },
                showSelectButton: false,
              },
            }),
          })),
        ]}
      />
    )
  );
};

export default CalculationDetailsMap;
