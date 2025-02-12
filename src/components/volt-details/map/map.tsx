/* eslint-disable no-underscore-dangle */

"use client";

import dynamic from "next/dynamic";
import { FC, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import { z } from "zod";
import { MapGeoJson } from "@/types/mapbox";
import { createMarkerImage, mapDefaultMarkers } from "@/lib/map";
import { Map as MapBoX, Popup } from "mapbox-gl";
import { IPropertiesInteraction } from "@/types/volt";

const Map = dynamic(() => import("@/components/maps/mapbox/mapbox-base"), { ssr: false });

const mapData = {
  sources: {
    markersSource: "markersSource",
  },
  layers: {
    markersLayer: "markersLayer",
    markerClusterCountLayer: "markers-cluster-count-layer",
    markerClusterLayer: "markers-cluster-layer",
  },
};

interface VoltDetailsMapProps {
  data: z.infer<typeof PropertyDataSchema>;
  isNonValidMedianHighlighted: boolean;
  onMarkerInteraction: (data: Partial<IPropertiesInteraction>) => void;
  onMouseLeave: () => void;
  propertiesInteraction: IPropertiesInteraction;
  selectedLayer: string;
}

const VoltDetailsMap: FC<VoltDetailsMapProps> = ({
  data,
  isNonValidMedianHighlighted,
  onMarkerInteraction,
  onMouseLeave,
  propertiesInteraction,
  selectedLayer,
}) => {
  const [ref, setRef] = useState<MapBoX | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const addMarkerImages = useCallback(
    (data: Record<string, string>) =>
      Promise.all(
        Object.keys(data).map(
          (key) =>
            new Promise((resolve) => {
              const img = createMarkerImage(data[key]);
              img.onload = (e) => {
                ref?.loadImage(data[key], () => {
                  ref!.addImage(key, img);
                  resolve(img);
                });
              };
            })
        )
      ),
    [ref]
  );
  const setInitialData = useCallback(async () => {
    if (ref) {
      Object.values(mapData.layers).forEach((el) => {
        const layer = ref.getLayer(el);
        if (layer) {
          ref.removeLayer(layer.id);
        }
      });

      Object.keys(mapDefaultMarkers).forEach((img) => {
        const image = ref.hasImage(img);
        if (image) {
          ref.removeImage(img);
        }
      });

      Object.values(mapData.sources).forEach((el) => {
        const source = ref.getSource(el);
        if (source) {
          ref.removeSource(el);
        }
      });

      window.map = ref;
      await addMarkerImages(mapDefaultMarkers);

      const mainLandBulkGroup = data.assessments.data.find((el) => el.isBulked && el.data.properties.find((el) => el.id === data.id));
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
          id: data.id,
          parcelNumber: data.parcelNumber.formattedString,
          parcelNumberNoFormatting: data.parcelNumber.formattedString,
          lng: data.lon,
          lat: data.lat,
          type: "selling",
          markerIcon:
            mainLandBulkGroup && mainLandBulkGroup.isBulked
              ? `green-highlighted-${mainLandBulkGroup.data.group}`
              : "green-highlighted-default",
          hoveredMarkerIcon:
            mainLandBulkGroup && mainLandBulkGroup.isBulked
              ? `green-highlighted-${mainLandBulkGroup.data.group}`
              : "green-highlighted-default",
          selectedMarkerIcon:
            mainLandBulkGroup && mainLandBulkGroup.isBulked
              ? `green-highlighted-${mainLandBulkGroup.data.group}`
              : "green-highlighted-default",
          markerSize: 1,
          hoveredMarkerSize: 1,
          selectedMarkerSize: 1,
          acreage: data.acreage.formattedString,
          price: data.price.formattedString,
          pricePerAcreage: data.pricePerAcreage.formattedString,
          polygonLineColor: "#05471C",
          polygonFillColor: "#05471C",
          // bulkId: (mainLandBulkGroup?.isBulked && mainLandBulkGroup?.data.id) || null,
          isBulkMedianValid: mainLandBulkGroup?.data.isMedianValid,
          group: mainLandBulkGroup?.isBulked ? mainLandBulkGroup?.data.group : undefined,
        },
      });

      data.assessments.data.forEach((el) => {
        if (el.isBulked) {
          el.data.properties.forEach((childEl) => {
            if (childEl.id !== data.id) {
              geoJsonInit.features.push({
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [childEl.longitude, childEl.latitude],
                },
                properties: {
                  id: childEl.id,
                  parcelNumberNoFormatting: childEl.parcelNumber.formattedString,
                  parcelNumber: childEl.parcelNumber.formattedString,
                  lng: childEl.longitude,
                  lat: childEl.latitude,
                  type: el.data.isMedianValid ? "calculation-valid" : "calculation-not-valid",
                  markerIcon: `red-${el.data.group}`,
                  hoveredMarkerIcon: `red-highlighted-${el.data.group}`,
                  selectedMarkerIcon: `red-highlighted-${el.data.group}`,
                  markerSize: 1,
                  hoveredMarkerSize: 1,
                  selectedMarkerSize: 1,
                  acreage: childEl.acreage.formattedString,
                  price: childEl.lastSalePrice.formattedString,
                  pricePerAcreage: childEl.pricePerAcreage.formattedString,
                  lastSaleDate: childEl.lastSaleDate,
                  polygonLineColor: "#05471C",
                  polygonFillColor: "#05471C",
                  bulkId: el.data.id,
                  isBulkMedianValid: el.data.isMedianValid,
                  group: el.data.group,
                },
              });
            }
          });
        } else if (el.data.id !== data.id) {
          geoJsonInit.features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [el.data.longitude, el.data.latitude],
            },
            properties: {
              id: el.data.id,
              parcelNumberNoFormatting: el.data.parcelNumber.formattedString,
              parcelNumber: el.data.parcelNumber.formattedString,
              lng: el.data.longitude,
              lat: el.data.latitude,
              type: el.data.isMedianValid ? "calculation-valid" : "calculation-not-valid",
              markerIcon: "red-default",
              hoveredMarkerIcon: "red-highlighted-default",
              selectedMarkerIcon: "red-highlighted-default",
              markerSize: 1,
              hoveredMarkerSize: 1,
              selectedMarkerSize: 1,
              acreage: el.data.acreage.formattedString,
              price: el.data.lastSalePrice.formattedString,
              pricePerAcreage: el.data.pricePerAcreage.formattedString,
              lastSaleDate: el.data.lastSaleDate,
              polygonLineColor: "#05471C",
              polygonFillColor: "#05471C",
            },
          });
        }
      });

      ref.addSource(mapData.sources.markersSource, {
        type: "geojson",
        data: geoJsonInit,
        generateId: true,
        ...(geoJsonInit.features.length > 50 && {
          cluster: true,
          clusterMaxZoom: 8,
          clusterRadius: 50,
        }),
      });

      ref
        .addLayer({
          id: mapData.layers.markersLayer,
          type: "symbol",
          source: mapData.sources.markersSource,
          layout: {
            "icon-image": "{markerIcon}",
            "icon-size": ["get", "markerSize"],
            "icon-allow-overlap": true,
          },
        })
        .on("dblclick", (e) => {
          const property = ref.queryRenderedFeatures(e.point)[0] as any;
          if (property) {
            e.preventDefault();
            ref.setZoom(14);
            ref.setCenter([property.properties.lng, property.properties.lat]);
          }
        });

      if (geoJsonInit.features.length > 50) {
        ref.addLayer({
          id: mapData.layers.markerClusterLayer,
          type: "circle",
          source: mapData.sources.markersSource,
          filter: ["has", "point_count"],
          paint: {
            "circle-color": ["step", ["get", "point_count"], "#51bbd6", 100, "#f1f075", 750, "#f28cb1"],
            "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
          },
        });

        ref.addLayer({
          id: mapData.layers.markerClusterCountLayer,
          type: "symbol",
          source: mapData.sources.markersSource,
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
  }, [addMarkerImages, data.acreage, data.assessments, data.lat, data.lon, data.parcelNumber, data.price, ref]);

  const updateMarkerColor = useCallback(() => {
    if (!ref) return;
    if (isNonValidMedianHighlighted) {
      const source = ref.getSource(mapData.sources.markersSource);
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
                  markerIcon: el.properties.bulkId ? `yellow-${el.properties.group}` : "yellow-default",
                  hoveredMarkerIcon: el.properties.bulkId ? `yellow-highlighted-${el.properties.group}` : "yellow-highlighted-default",
                  selectedMarkerIcon: el.properties.bulkId ? `yellow-highlighted-${el.properties.group}` : "yellow-highlighted-default",
                },
              }
            : el
        );
        source.setData({ ...newData });

        // source.setData({ ...newData });
      }
    } else {
      const source = ref.getSource(mapData.sources.markersSource);
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
                  markerIcon: el.properties.bulkId ? `red-${el.properties.group}` : "red-default",
                  hoveredMarkerIcon: el.properties.bulkId ? `red-highlighted-${el.properties.group}` : "red-highlighted-default",
                  selectedMarkerIcon: el.properties.bulkId ? `red-highlighted-${el.properties.group}` : "red-highlighted-default",
                },
              }
            : el
        );
        source.setData({ ...newData });
      }
    }
  }, [isNonValidMedianHighlighted, ref]);

  const handleMarkerInteraction = useCallback(() => {
    ref?.on("mousemove", mapData.layers.markersLayer, (e) => {
      const feature = ref.queryRenderedFeatures(e.point)[0].properties as MapGeoJson["features"][0]["properties"];
      if (feature) {
        onMarkerInteraction({
          hover: { clickId: feature.id, isBulked: !!feature.bulkId, openId: feature.bulkId ? feature.bulkId : feature.id },
        });
      }
    });

    ref?.on("mouseleave", mapData.layers.markersLayer, (e) => {
      onMouseLeave();
    });

    ref?.on("click", mapData.layers.markersLayer, (e) => {
      const feature = ref.queryRenderedFeatures(e.point)[0].properties as MapGeoJson["features"][0]["properties"];
      console.log(feature, 22);

      if (feature) {
        onMarkerInteraction({
          popup: { clickId: feature.id, isBulked: !!feature.bulkId, openId: feature.bulkId ? feature.bulkId : feature.id },
        });
      }
    });
  }, [onMarkerInteraction, onMouseLeave, ref]);

  const openTooltip = useCallback(
    ({ lat, lng, popupRef }: { lng: number; lat: number; popupRef: any }) => {
      if (ref) {
        const existedTooltip = ref._popups.find((el) => el._classList.has("tooltip"));
        if (existedTooltip) {
          existedTooltip.remove();
        }
        new Popup({
          closeButton: false,
          className: "[&>div:last-child]:rounded-xl [&>div:last-child]:shadow-5 [&>div:last-child]:p-3 tooltip",
          closeOnClick: false,
          closeOnMove: false,
          offset: [0, -20],
        })
          .setLngLat([lng, lat])
          .setDOMContent(popupRef.current)
          .setMaxWidth("max-content")
          .addTo(ref);
      }
    },

    [ref]
  );

  const highlightMarkers = useCallback(() => {
    if (!ref || !ref.getLayer(mapData.layers.markersLayer)) return;

    const list: Array<{
      id: string;
      action: any;
      bulkId: any;
    }> = [];

    if (propertiesInteraction.hover) {
      list.push({
        action: "hovered",
        id: propertiesInteraction.hover.openId,
        bulkId: propertiesInteraction.hover.isBulked && propertiesInteraction.hover.openId,
      });
    }

    if (propertiesInteraction.popup) {
      list.push({
        action: "popup",
        id: propertiesInteraction.popup.openId,
        bulkId: propertiesInteraction.popup.isBulked && propertiesInteraction.popup.openId,
      });
    }
    // const hoveredMarker = list.find((el) => el.action === "hovered");

    if (propertiesInteraction.hover) {
      const property = data.assessments.data.find((el) => el.data.id === propertiesInteraction.hover?.openId);

      if (property) {
        const lat = property.isBulked ? property.data.properties[0].latitude : property.data.latitude;
        const lng = property.isBulked ? property.data.properties[0].longitude : property.data.longitude;
        if (propertiesInteraction.popup && propertiesInteraction.popup.openId === property.data.id) {
          return;
        }
        openTooltip({
          lat,
          lng,
          popupRef: tooltipRef,
        });
      }
    } else {
      ref._popups.forEach((el) => {
        if (el._classList.has("tooltip")) {
          el.remove();
        }
      });
    }

    if (list.length) {
      const markerIconFilters = list.map((el) => {
        // eslint-disable-next-line no-nested-ternary
        const markerType = el.action === "hovered" ? "hoveredMarkerIcon" : "selectedMarkerIcon";

        return [
          ["==", ["get", el.bulkId ? "bulkId" : "id"], el.bulkId ? el.bulkId : el.id],
          ["get", markerType],
        ];
      });

      ref.setLayoutProperty(mapData.layers.markersLayer, "icon-image", [
        "case",
        ...markerIconFilters.flat(),
        ["get", "markerIcon"], // Otherwise, use default icon
      ]);

      ///
      const symbolSortFilters = list.map((el) => [["==", ["get", el.bulkId ? "bulkId" : "id"], el.bulkId ? el.bulkId : el.id], 2]);

      ref.setLayoutProperty(mapData.layers.markersLayer, "symbol-sort-key", ["case", ...symbolSortFilters.flat(), 1]);
      ///

      const markerSizeFilters = list.map((el) => {
        const markerSize = el.action === "hovered" ? "hoveredMarkerSize" : "selectedMarkerSize";

        return [
          ["==", ["get", el.bulkId ? "bulkId" : "id"], el.bulkId ? el.bulkId : el.id],
          ["get", markerSize],
        ];
      });

      ref.setLayoutProperty(mapData.layers.markersLayer, "icon-size", [
        "case",
        ...markerSizeFilters.flat(),
        ["get", "markerSize"], // Otherwise, use default icon
      ]);
    } else {
      ref.setLayoutProperty(mapData.layers.markersLayer, "icon-image", ["get", "markerIcon"]);
      ref.setLayoutProperty(mapData.layers.markersLayer, "icon-size", ["get", "markerSize"]);
    }
  }, [data.assessments, openTooltip, propertiesInteraction, ref]);

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

  useEffect(() => {
    if (ref) {
      ref.on("style.load", () => {
        setInitialData();
      });
    }
  }, [ref, setInitialData]);

  useEffect(() => {
    if (ref && selectedLayer) {
      ref.setStyle(selectedLayer);
    }
  }, [ref, selectedLayer]);

  return (
    <>
      <div style={{ display: "none" }}>
        <div className="" ref={tooltipRef}>
          <ul>
            <li className="flex items-center gap-2">
              <div className="rounded-full size-1.5 bg-primary-main-400" />
              <p className="text-grey-600 font-medium text-sm max-w-40">Click to get info</p>
            </li>
            <li className="flex items-center gap-2">
              <div className="rounded-full size-1.5 bg-primary-main-400" />
              <p className="text-grey-600 font-medium text-sm max-w-40">Double click to zoom in</p>
            </li>
          </ul>
        </div>
      </div>
      <Suspense fallback={<div className="w-full h-[full] bg-primary-main-800 animate-pulse" />}>
        <Map setRef={setRef} ref={ref} />
      </Suspense>
    </>
  );
};

export default VoltDetailsMap;
