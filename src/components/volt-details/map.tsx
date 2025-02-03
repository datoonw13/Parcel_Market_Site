/* eslint-disable no-underscore-dangle */

"use client";

import useMap from "@/hooks/useMap";
import dynamic from "next/dynamic";
import { Dispatch, FC, SetStateAction, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import { z } from "zod";
import { MapGeoJson } from "@/types/mapbox";
import { createMarkerImage, mapDefaultMarkers } from "@/lib/map";
import { GeoJSONFeature, Map as MapBoX, Popup } from "mapbox-gl";
import { icon } from "leaflet";

const Map = dynamic(() => import("@/components/maps/mapbox/mapbox-base"), { ssr: false });

interface VoltDetailsMapProps {
  data: z.infer<typeof PropertyDataSchema>;
  isNonValidMedianHighlighted: boolean;
  onMarkerInteraction: (parcelNumberNoFormatting: string, action: "hover" | "popup") => void;
  onMouseLeave: () => void;
  onPopupClose: () => void;
  propertiesInteraction: { [key: string]: "hovered" | "popup" };
}

const VoltDetailsMap: FC<VoltDetailsMapProps> = ({
  data,
  isNonValidMedianHighlighted,
  onMarkerInteraction,
  onMouseLeave,
  propertiesInteraction,
  onPopupClose,
}) => {
  const [ref, setRef] = useState<MapBoX | null>(null);
  // const [openPopupDetails, setOpenPopupDetails] = useState<VoltDetailsMapProps["data"]["assessments"][0] | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const openPopupDetails = useMemo(() => {
    const id = Object.keys(propertiesInteraction).find((key) => propertiesInteraction[key] === "popup");
    if (!id) {
      return null;
    }
    const property = data.assessments.find((el) => (el.isBulked ? el.data.id === id : el.data.parcelNumberNoFormatting === id));
    const isSellingProperty = !property?.isBulked && property?.data.parcelNumberNoFormatting === data.parcelNumberNoFormatting;

    return {
      property,
      isSellingProperty,
    };
  }, [data.assessments, data.parcelNumberNoFormatting, propertiesInteraction]);

  console.log(data);

  const addMarkerImages = useCallback(
    (data: Record<string, string>) =>
      Promise.all(
        Object.keys(data).map(
          (key) =>
            new Promise((resolve) => {
              const img = createMarkerImage(data[key]);
              img.onload = (e) => {
                ref!.addImage(key, img);
                resolve(img);
              };
            })
        )
      ),
    [ref]
  );

  const setInitialData = useCallback(async () => {
    if (ref) {
      if (ref.getSource("markers-source")) {
        const source = ref.getSource("markers-source");
        if (source?.type === "geojson") {
          const geoJsonInit: MapGeoJson = {
            type: "FeatureCollection",
            features: [],
          };
          geoJsonInit.features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [data.lon, data.lat],
            },
            properties: {
              parcelNumberNoFormatting: data.parcelNumberNoFormatting,
              parcelNumber: data.parcelNumber,
              lng: data.lon,
              lat: data.lat,
              type: "selling",
              markerIcon: "selling",
              hoveredMarkerIcon: "selling",
              selectedMarkerIcon: "selling",
              markerSize: 1.5,
              hoveredMarkerSize: 1.5,
              selectedMarkerSize: 1.5,
              acreage: data.acreage,
              price: data.price,
              pricePerAcreage: data.price / data.acreage,
              polygonLineColor: "#05471C",
              polygonFillColor: "#05471C",
            },
          });

          data.assessments.forEach((el) => {
            if (el.isBulked) {
              el.data.properties.forEach((childEl) => {
                if (childEl.parcelNumberNoFormatting !== data.parcelNumberNoFormatting) {
                  geoJsonInit.features.push({
                    type: "Feature",
                    geometry: {
                      type: "Point",
                      coordinates: [childEl.longitude, childEl.latitude],
                    },
                    properties: {
                      parcelNumberNoFormatting: childEl.parcelNumberNoFormatting,
                      parcelNumber: childEl.parcelNumber,
                      lng: childEl.longitude,
                      lat: childEl.latitude,
                      type: el.data.isMedianValid ? "calculation-valid" : "calculation-not-valid",
                      markerIcon: "red",
                      hoveredMarkerIcon: "redHighlighted",
                      selectedMarkerIcon: "redHighlighted",
                      markerSize: 1,
                      hoveredMarkerSize: 1.5,
                      selectedMarkerSize: 1.5,
                      acreage: childEl.acreage,
                      price: childEl.lastSalesPrice,
                      pricePerAcreage: childEl.pricePerAcreage,
                      lastSaleDate: childEl.lastSalesDate,
                      polygonLineColor: "#05471C",
                      polygonFillColor: "#05471C",
                      bulkId: el.data.id,
                      isBulkMedianValid: el.data.isMedianValid,
                    },
                  });
                }
              });
            } else if (el.data.parcelNumberNoFormatting !== data.parcelNumberNoFormatting) {
              geoJsonInit.features.push({
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [el.data.longitude, el.data.latitude],
                },
                properties: {
                  parcelNumberNoFormatting: el.data.parcelNumberNoFormatting,
                  parcelNumber: el.data.parcelNumber,
                  lng: el.data.longitude,
                  lat: el.data.latitude,
                  type: el.data.isMedianValid ? "calculation-valid" : "calculation-not-valid",
                  markerIcon: "red",
                  hoveredMarkerIcon: "redHighlighted",
                  selectedMarkerIcon: "redHighlighted",
                  markerSize: 1,
                  hoveredMarkerSize: 1.5,
                  selectedMarkerSize: 1.5,
                  acreage: el.data.acreage,
                  price: el.data.lastSalesPrice,
                  pricePerAcreage: el.data.pricePerAcreage,
                  lastSaleDate: el.data.lastSalesDate,
                  polygonLineColor: "#05471C",
                  polygonFillColor: "#05471C",
                },
              });
            }
          });
          source.setData(geoJsonInit);
        }
        return;
      }
      await addMarkerImages(mapDefaultMarkers);
      const geoJsonInit: MapGeoJson = {
        type: "FeatureCollection",
        features: [],
      };
      geoJsonInit.features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [data.lon, data.lat],
        },
        properties: {
          parcelNumberNoFormatting: data.parcelNumberNoFormatting,
          parcelNumber: data.parcelNumber,
          lng: data.lon,
          lat: data.lat,
          type: "selling",
          markerIcon: "selling",
          hoveredMarkerIcon: "selling",
          selectedMarkerIcon: "selling",
          markerSize: 1.5,
          hoveredMarkerSize: 1.5,
          selectedMarkerSize: 1.5,
          acreage: data.acreage,
          price: data.price,
          pricePerAcreage: data.price / data.acreage,
          polygonLineColor: "#05471C",
          polygonFillColor: "#05471C",
        },
      });

      data.assessments.forEach((el) => {
        if (el.isBulked) {
          el.data.properties.forEach((childEl) => {
            if (childEl.parcelNumberNoFormatting !== data.parcelNumberNoFormatting) {
              geoJsonInit.features.push({
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [childEl.longitude, childEl.latitude],
                },
                properties: {
                  parcelNumberNoFormatting: childEl.parcelNumberNoFormatting,
                  parcelNumber: childEl.parcelNumber,
                  lng: childEl.longitude,
                  lat: childEl.latitude,
                  type: el.data.isMedianValid ? "calculation-valid" : "calculation-not-valid",
                  markerIcon: "red",
                  hoveredMarkerIcon: "redHighlighted",
                  selectedMarkerIcon: "redHighlighted",
                  markerSize: 1,
                  hoveredMarkerSize: 1.5,
                  selectedMarkerSize: 1.5,
                  acreage: childEl.acreage,
                  price: childEl.lastSalesPrice,
                  pricePerAcreage: childEl.pricePerAcreage,
                  lastSaleDate: childEl.lastSalesDate,
                  polygonLineColor: "#05471C",
                  polygonFillColor: "#05471C",
                  bulkId: el.data.id,
                  isBulkMedianValid: el.data.isMedianValid,
                },
              });
            }
          });
        } else if (el.data.parcelNumberNoFormatting !== data.parcelNumberNoFormatting) {
          geoJsonInit.features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [el.data.longitude, el.data.latitude],
            },
            properties: {
              parcelNumberNoFormatting: el.data.parcelNumberNoFormatting,
              parcelNumber: el.data.parcelNumber,
              lng: el.data.longitude,
              lat: el.data.latitude,
              type: el.data.isMedianValid ? "calculation-valid" : "calculation-not-valid",
              markerIcon: "red",
              hoveredMarkerIcon: "redHighlighted",
              selectedMarkerIcon: "redHighlighted",
              markerSize: 1,
              hoveredMarkerSize: 1.5,
              selectedMarkerSize: 1.5,
              acreage: el.data.acreage,
              price: el.data.lastSalesPrice,
              pricePerAcreage: el.data.pricePerAcreage,
              lastSaleDate: el.data.lastSalesDate,
              polygonLineColor: "#05471C",
              polygonFillColor: "#05471C",
            },
          });
        }
      });

      ref.addSource("markers-source", {
        type: "geojson",
        data: geoJsonInit,
        generateId: true,
        ...(geoJsonInit.features.length > 50 && {
          cluster: true,
          clusterMaxZoom: 12,
          clusterRadius: 50,
        }),
      });

      ref.addLayer({
        id: "markers-layer",
        type: "symbol",
        source: "markers-source",
        layout: {
          "icon-image": "{markerIcon}",
          "icon-size": ["get", "markerSize"],
          "icon-allow-overlap": true,
        },
      });

      if (geoJsonInit.features.length > 50) {
        ref.addLayer({
          id: "markers-cluster",
          type: "circle",
          source: "markers-source",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": ["step", ["get", "point_count"], "#51bbd6", 100, "#f1f075", 750, "#f28cb1"],
            "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
          },
        });

        ref.addLayer({
          id: "markers-cluster-count",
          type: "symbol",
          source: "markers-source",
          filter: ["has", "point_count"],
          layout: {
            "text-field": ["get", "point_count_abbreviated"],
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
        });
      }

      ref.setZoom(8);
      ref.setCenter([data.lon, data.lat]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    addMarkerImages,
    data.acreage,
    data.assessments,
    data.lat,
    data.lon,
    data.parcelNumber,
    data.parcelNumberNoFormatting,
    data.price,
    ref,
  ]);

  const updateMarkerColor = useCallback(() => {
    if (!ref) return;
    if (isNonValidMedianHighlighted) {
      const source = ref.getSource("markers-source");
      if (source?.type === "geojson") {
        const data = source._data as MapGeoJson;
        const newData = {
          ...data,
        };
        newData.features = data.features.map((el) =>
          el.properties.type === "calculation-not-valid"
            ? {
                ...el,
                properties: {
                  ...el.properties,
                  markerIcon: "yellow",
                  hoveredMarkerIcon: "yellowHighlighted",
                  selectedMarkerIcon: "yellowHighlighted",
                },
              }
            : el
        );
        source.setData({ ...newData });

        // source.setData({ ...newData });
      }
    } else {
      const source = ref.getSource("markers-source");
      if (source?.type === "geojson") {
        const data = source._data as MapGeoJson;
        const newData = {
          ...data,
        };
        newData.features = data.features.map((el) =>
          el.properties.type === "calculation-not-valid"
            ? {
                ...el,
                properties: {
                  ...el.properties,
                  markerIcon: "red",
                  hoveredMarkerIcon: "redHighlighted",
                  selectedMarkerIcon: "redHighlighted",
                },
              }
            : el
        );
        source.setData({ ...newData });
      }
    }
  }, [isNonValidMedianHighlighted, ref]);

  const handleMarkerInteraction = useCallback(() => {
    ref?.on("mouseover", "markers-layer", (e) => {
      const feature = ref.queryRenderedFeatures(e.point)[0].properties as MapGeoJson["features"][0]["properties"];
      if (feature) {
        const id = feature.bulkId ? feature.bulkId : feature.parcelNumberNoFormatting;
        onMarkerInteraction(id, "hover");
      }
    });

    ref?.on("mouseleave", "markers-layer", (e) => {
      onMouseLeave();
    });

    ref?.on("click", "markers-layer", (e) => {
      const feature = ref.queryRenderedFeatures(e.point)[0].properties as MapGeoJson["features"][0]["properties"];

      if (feature) {
        const id = feature.bulkId ? feature.bulkId : feature.parcelNumberNoFormatting;
        if (id) {
          onMarkerInteraction(id, "popup");
        }
      }
    });
  }, [onMarkerInteraction, onMouseLeave, ref]);

  const openPopup = useCallback(
    ({ lat, lng, popupRef, onClose }: { lng: number; lat: number; popupRef: any; onClose: () => void }) => {
      if (ref) {
        new Popup({ closeButton: false, className: "[&>div:last-child]:rounded-xl [&>div:last-child]:shadow-4 [&>div:last-child]:p-3" })
          .setLngLat([lng, lat])
          .setDOMContent(popupRef.current)
          .setMaxWidth("max-content")
          .addTo(ref)
          .on("close", () => {
            onClose();
          });
      }
    },

    [ref]
  );

  const highlightMarkers = useCallback(() => {
    if (!ref || !ref.getLayer("markers-layer")) return;
    const hoveredMarker = Object.keys(propertiesInteraction).find((key) => propertiesInteraction[key] === "hovered");
    const openPopupMarker = Object.keys(propertiesInteraction).find((key) => propertiesInteraction[key] === "popup");

    const list: Array<{ [key: string]: "default" | "hovered" | "selected" }> = [];

    if (hoveredMarker) {
      list.push({ [hoveredMarker]: "hovered" });
    }
    if (openPopupMarker) {
      list.push({ [openPopupMarker]: "hovered" });
      const property = data.assessments.find((el) =>
        el.isBulked ? el.data.id === openPopupMarker : el.data.parcelNumberNoFormatting === openPopupMarker
      );

      if (property) {
        if (property.isBulked) {
          openPopup({
            lat: property.data.properties[0].latitude,
            lng: property.data.properties[0].longitude,
            popupRef,
            onClose: () => {
              onPopupClose();
            },
          });
        } else {
          openPopup({
            lat: property.data.latitude,
            lng: property.data.longitude,
            popupRef,
            onClose: () => {
              onPopupClose();
            },
          });
        }
      }
    }

    if (list.length) {
      const markerIconFilters = list.map((el) => {
        const [key, value] = [Object.keys(el)[0], Object.values(el)[0]];
        // eslint-disable-next-line no-nested-ternary
        const markerType = value === "default" ? "markerSize" : value === "hovered" ? "hoveredMarkerIcon" : "selectedMarkerIcon";

        return [
          ["==", ["get", key.includes("multiple") ? "bulkId" : "parcelNumberNoFormatting"], key],
          ["get", markerType],
        ];
      });

      ref.setLayoutProperty("markers-layer", "icon-image", [
        "case",
        ...markerIconFilters.flat(),
        ["get", "markerIcon"], // Otherwise, use default icon
      ]);

      const markerSizeFilters = list.map((el) => {
        const [key, value] = [Object.keys(el)[0], Object.values(el)[0]];
        // eslint-disable-next-line no-nested-ternary
        const markerSize = value === "default" ? "markerSize" : value === "hovered" ? "hoveredMarkerSize" : "selectedMarkerSize";

        return [
          ["==", ["get", key.includes("multiple") ? "bulkId" : "parcelNumberNoFormatting"], key],
          ["get", markerSize],
        ];
      });

      ref.setLayoutProperty("markers-layer", "icon-size", [
        "case",
        ...markerSizeFilters.flat(),
        ["get", "markerSize"], // Otherwise, use default icon
      ]);
    } else {
      ref.setLayoutProperty("markers-layer", "icon-image", ["get", "markerIcon"]);
      ref.setLayoutProperty("markers-layer", "icon-size", ["get", "markerSize"]);
    }
  }, [data, onPopupClose, openPopup, propertiesInteraction, ref]);

  useEffect(() => {
    setInitialData();
  }, [setInitialData]);

  useEffect(() => {
    updateMarkerColor();
  }, [updateMarkerColor]);

  useEffect(() => {
    handleMarkerInteraction();
  }, [handleMarkerInteraction]);

  useEffect(() => {
    highlightMarkers();
  }, [highlightMarkers]);

  return (
    <>
      <div style={{ display: "none" }}>
        {openPopupDetails && (
          <div ref={popupRef}>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2">
              <li className="flex items-center gap-3">
                <div className="rounded-full size-1.5 bg-primary-main-400" />
                <div>
                  <p className="text-grey-600 font-medium text-sm">Owner</p>
                  <p className="text-black font-medium text-sm">
                    {openPopupDetails.property?.isBulked
                      ? openPopupDetails.property.data.properties[0].owner || "N/A"
                      : openPopupDetails.property?.data.owner || "N/A"}
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="rounded-full size-1.5 bg-primary-main-400" />
                <div>
                  <p className="text-grey-600 font-medium text-sm">Acreage</p>
                  <p className="text-black font-medium text-sm">{openPopupDetails.property?.data.acreage.toFixed(2)}</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="rounded-full size-1.5 bg-primary-main-400" />
                <div>
                  <p className="text-grey-600 font-medium text-sm">State/County</p>
                  <p className="text-black font-medium text-sm">
                    {openPopupDetails.property?.isBulked
                      ? `${openPopupDetails.property?.data.properties[0].state}/${openPopupDetails.property?.data.properties[0].county}`
                      : `${openPopupDetails.property?.data.state}/${openPopupDetails.property?.data.county}`}
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="rounded-full size-1.5 bg-primary-main-400" />
                <div>
                  <p className="text-grey-600 font-medium text-sm">VOLT Value</p>
                  <p className="text-black font-medium text-sm">Name, Surname</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="rounded-full size-1.5 bg-primary-main-400" />
                <div>
                  <p className="text-grey-600 font-medium text-sm">Owner</p>
                  <p className="text-black font-medium text-sm">Name, Surname</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="rounded-full size-1.5 bg-primary-main-400" />
                <div>
                  <p className="text-grey-600 font-medium text-sm">Owner</p>
                  <p className="text-black font-medium text-sm">Name, Surname</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="rounded-full size-1.5 bg-primary-main-400" />
                <div>
                  <p className="text-grey-600 font-medium text-sm">Owner</p>
                  <p className="text-black font-medium text-sm">Name, Surname</p>
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
      <Suspense fallback={<div className="w-full h-[full] bg-primary-main-800 animate-pulse" />}>
        <Map setRef={setRef} ref={ref} />
      </Suspense>
    </>
  );
};

export default VoltDetailsMap;
