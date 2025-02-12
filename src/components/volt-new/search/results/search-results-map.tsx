"use client";

import { voltAtom } from "@/atoms/volt-atom";
import useMap from "@/hooks/useMap";
import { useAtom } from "jotai";
import dynamic from "next/dynamic";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import * as turf from "@turf/turf";
import { MapGeoJson } from "@/types/mapbox";
import { mapDefaultMarkers } from "@/lib/map";
import { propertyInteractionAtom } from "@/atoms/property-interaction-atom";
import { Button } from "@/components/ui/button";

const Map = dynamic(() => import("@/components/maps/mapbox/mapbox-base"), { ssr: false });

const VoltSearchResultsMap = () => {
  const searchResultPopupRef = useRef<HTMLDivElement>(null);
  const [voltAtomValue, setVoltAtom] = useAtom(voltAtom);
  const [propertyInteractionAtomValue, setPropertyInteractionAtom] = useAtom(propertyInteractionAtom);

  const { ref, setRef, geoJson, setGeoJson, showMarkers, showRegridTiles, addMarkerImages, openPopup, highlightFeatures } = useMap();
  const [popupDetails, setPopupDetails] = useState<{
    owner: string;
    acreage: number;
    parcelNumberNoFormatting: string;
  } | null>(null);

  const showSearchResult = useCallback(async () => {
    if (ref && voltAtomValue.searchResults) {
      const geoJsonInit: MapGeoJson = {
        type: "FeatureCollection",
        features: [],
      };
      voltAtomValue.searchResults.forEach((feature) => {
        geoJsonInit.features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [feature.lon, feature.lat],
          },
          properties: {
            id: feature.id.toString(),
            owner: feature.owner,
            parcelNumberNoFormatting: feature.parcelNumberNoFormatting,
            parcelNumber: feature.parcelNumber,
            lng: feature.lon,
            lat: feature.lat,
            type: "selling",
            markerIcon: voltAtomValue.searchResults!.length === 1 ? "selling" : "red",
            hoveredMarkerIcon: voltAtomValue.searchResults!.length === 1 ? "selling" : "redHighlighted",
            selectedMarkerIcon: "selling",
            markerSize: voltAtomValue.searchResults!.length === 1 ? 1.5 : 1,
            hoveredMarkerSize: voltAtomValue.searchResults!.length === 1 ? 1.5 : 1.2,
            selectedMarkerSize: voltAtomValue.searchResults!.length === 1 ? 1.5 : 1.2,
            acreage: feature.acreage,
            polygonLineColor: "#05471C",
            polygonFillColor: "#05471C",
          },
        });
      });

      addMarkerImages(mapDefaultMarkers);
      setGeoJson(geoJsonInit);
      showMarkers({
        onMarkerMouseEnter: (parcelNumberNoFormatting) => {
          setPropertyInteractionAtom((prev) => ({
            ...prev,
            hoveredParcelNumber: prev.selectedParcelNumber === parcelNumberNoFormatting ? null : parcelNumberNoFormatting,
          }));
        },
        onMarkerMouseLeave: () => {
          setPropertyInteractionAtom((prev) => ({ ...prev, hoveredParcelNumber: null }));
        },
        onClick: (parcelNumberNoFormatting) => {
          setPropertyInteractionAtom((prev) => ({
            ...prev,
            hoveredParcelNumber: null,
            selectedParcelNumber: parcelNumberNoFormatting,
          }));
        },
        cluster: geoJsonInit.features.length > 100,
      });
      showRegridTiles({
        onMarkerMouseEnter: (parcelNumberNoFormatting) => {
          setPropertyInteractionAtom((prev) => ({
            ...prev,
            hoveredParcelNumber: prev.selectedParcelNumber === parcelNumberNoFormatting ? null : parcelNumberNoFormatting,
          }));
        },
        onMarkerMouseLeave: () => {
          setPropertyInteractionAtom((prev) => ({ ...prev, hoveredParcelNumber: null }));
        },
        onClick: (parcelNumberNoFormatting) => {
          setPropertyInteractionAtom((prev) => ({
            ...prev,
            hoveredParcelNumber: null,
            selectedParcelNumber: parcelNumberNoFormatting,
          }));
        },
      });

      const features = turf.points([...voltAtomValue.searchResults.map((el) => [el.lon, el.lat])]);

      const center = turf.center(features);
      ref.setCenter(center.geometry.coordinates as any);
      ref.setZoom(8);
    }
  }, [addMarkerImages, ref, setGeoJson, setPropertyInteractionAtom, showMarkers, showRegridTiles, voltAtomValue.searchResults]);

  const handleMarkerInteractions = useCallback(() => {
    if (ref) {
      const data: any = [];

      if (propertyInteractionAtomValue.hoveredParcelNumber) {
        propertyInteractionAtomValue.hoveredParcelNumber.split("multiple").forEach((el) => {
          data.push({ [el]: "hovered" });
        });
      }

      if (propertyInteractionAtomValue.selectedParcelNumber) {
        propertyInteractionAtomValue.selectedParcelNumber.split("multiple").forEach((el) => {
          data.push({ [el]: "selected" });
        });
        const feature = geoJson.features.find((el) =>
          propertyInteractionAtomValue.selectedParcelNumber!.includes("multiple")
            ? el.properties.bulkId === propertyInteractionAtomValue.selectedParcelNumber
            : el.properties.parcelNumberNoFormatting === propertyInteractionAtomValue.selectedParcelNumber
        );
        if (feature) {
          openPopup({
            lat: feature.properties.lat,
            lng: feature.properties.lng,
            onClose: () => {
              setPropertyInteractionAtom((prev) => ({ ...prev, selectedParcelNumber: null }));
            },
            popupRef: searchResultPopupRef.current,
          });

          setPopupDetails({
            owner: feature.properties.owner || "",
            acreage: Number(feature.properties.acreage),
            parcelNumberNoFormatting: feature.properties.parcelNumberNoFormatting,
          });
        }
      }
      highlightFeatures(data);
    }
  }, [
    ref,
    propertyInteractionAtomValue.hoveredParcelNumber,
    propertyInteractionAtomValue.selectedParcelNumber,
    highlightFeatures,
    geoJson.features,
    openPopup,
    setPropertyInteractionAtom,
  ]);

  useEffect(() => {
    showSearchResult();
  }, [ref, showSearchResult]);

  useEffect(() => {
    handleMarkerInteractions();
  }, [handleMarkerInteractions]);

  useEffect(
    () => () => {
      console.log("unm");
    },
    []
  );

  return (
    <>
      <div style={{ display: "none" }}>
        <div ref={searchResultPopupRef}>
          {popupDetails && (
            <ul className="">
              <>
                <li className="text-xs text-grey-800 py-0.5">
                  Parcel Number: <span className="text-black font-semibold">{popupDetails.parcelNumberNoFormatting}</span>
                </li>
                <li className="text-xs text-grey-800 py-0.5">
                  Owner: <span className="text-black font-semibold">{popupDetails.owner}</span>
                </li>
                <li className="text-xs text-grey-800 py-0.5">
                  Acreage: <span className="text-black font-semibold">{popupDetails.acreage}</span>
                </li>
                {voltAtomValue.searchResults && voltAtomValue.searchResults?.length > 1 && (
                  <Button
                    className="py-1 h-auto !px-6 ml-auto flex mt-4"
                    onClick={() => {
                      setVoltAtom((prev) => ({
                        ...prev,
                        sellingPropertyParcelNumber:
                          prev.sellingPropertyParcelNumber === popupDetails.parcelNumberNoFormatting
                            ? null
                            : popupDetails.parcelNumberNoFormatting,
                      }));
                    }}
                  >
                    {voltAtomValue?.sellingPropertyParcelNumber === popupDetails.parcelNumberNoFormatting ? "Remove" : "Select"}
                  </Button>
                )}
              </>
            </ul>
          )}
        </div>
      </div>
      <Suspense fallback={<div className="w-full h-full bg-primary-main-100 animate-pulse" />}>
        <Map setRef={setRef} ref={ref} />
      </Suspense>
    </>
  );
};

export default VoltSearchResultsMap;
