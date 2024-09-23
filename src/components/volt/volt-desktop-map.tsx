"use client";

import { voltAtom } from "@/atoms/volt-atom";
import { VoltSteps } from "@/types/volt";
import { useAtom } from "jotai";
import { Map as LeafletMap, Marker } from "leaflet";
import dynamic from "next/dynamic";
import { FC, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

const Map = dynamic(() => import("@/components/shared/map/Map"), { ssr: false });

interface VoltDesktopProps {
  step: VoltSteps;
  highlightedParcelNumber: string | null;
  onMarkerMouseEnter: (parcelNumberNoFormatting: string) => void;
  onMarkerMouseLeave: (parcelNumberNoFormatting: string) => void;
}

const VoltDesktopMap: FC<VoltDesktopProps> = ({ step, highlightedParcelNumber, onMarkerMouseEnter, onMarkerMouseLeave }) => {
  const [voltSlice, setVoltSlice] = useAtom(voltAtom);
  const markerRefs = useRef<{ [key: string]: Marker }>();
  const mapRef = useRef<LeafletMap | null>(null);

  const mapData = () => {
    if (step === VoltSteps.SEARCH) {
      return [{ parcelNumber: "test", latitude: 39.8283459, longitude: -98.5794797, center: true, markerType: "none" as const }];
    }
    if (step === VoltSteps.SEARCH_RESULTS && voltSlice.searchResult) {
      return voltSlice.searchResult?.map((el) => ({
        parcelNumber: el.properties.fields.parcelnumb_no_formatting || "",
        latitude: Number(el.properties.fields.lat),
        longitude: Number(el.properties.fields.lon),
        polygon: el.geometry.coordinates,
        markerType:
          voltSlice.selectedItem?.properties.fields.parcelnumb_no_formatting === el.properties.fields.parcelnumb_no_formatting
            ? ("active" as const)
            : ("default" as const),
        popup: (
          <div className="flex flex-col gap-1 space-y-2">
            <p className="!p-0 !m-0">
              Owner: <b>{el.properties.fields.owner}</b>
            </p>
            <p className="!p-0 !m-0">
              Parcel Number: <b>{el.properties.fields.parcelnumb_no_formatting}</b>
            </p>
            <p className="!p-0 !m-0">
              Acreage: <b>{el.properties.fields.ll_gisacre.toFixed(2)}</b>
            </p>
            <Button
              className="py-1 h-auto !px-6 ml-auto flex mt-4"
              onClick={() => {
                setVoltSlice((prev) => ({
                  ...prev,
                  selectedItem:
                    voltSlice.selectedItem?.properties.fields.parcelnumb_no_formatting === el.properties.fields.parcelnumb_no_formatting
                      ? null
                      : el,
                }));
              }}
            >
              {voltSlice.selectedItem?.properties.fields.parcelnumb_no_formatting === el.properties.fields.parcelnumb_no_formatting
                ? "Remove"
                : "Select"}
            </Button>
          </div>
        ),
      }));
    }
    return [];
  };

  useEffect(() => {
    if (highlightedParcelNumber && mapRef.current) {
      const itemRef = markerRefs.current?.[highlightedParcelNumber];
      if (itemRef) {
        itemRef.openPopup();
      }
    } else {
    }
  }, [highlightedParcelNumber]);

  return (
    <Map
      highlightItemParcelNumber={highlightedParcelNumber}
      properties={mapData()}
      zoom={step === VoltSteps.SEARCH ? 5 : 8}
      dragging={step !== VoltSteps.SEARCH}
      disableZoom={step === VoltSteps.SEARCH}
      setMarkerRef={(parcelNumber, ref) => {
        markerRefs.current = { ...markerRefs.current, [parcelNumber]: ref };
      }}
      markerMouseEnter={onMarkerMouseEnter}
      markerMouseLeave={onMarkerMouseLeave}
      setMapRef={(ref) => {
        mapRef.current = ref;
      }}
    />
  );
};

export default VoltDesktopMap;
