/* eslint-disable no-underscore-dangle */

"use client";

import dynamic from "next/dynamic";
import { FC, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapGeoJson } from "@/types/mapbox";
import { createMarkerImage, mapDefaultMarkers } from "@/lib/map";
import { Map as MapBoX, Popup } from "mapbox-gl";
import { IPropertiesInteraction } from "@/types/volt";
import { IMainPropertyBaseInfo } from "@/types/property";
import * as turf from "@turf/turf";
import { Button } from "../ui/button";

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

interface VoltSearchResultsMapProps {
  data: IMainPropertyBaseInfo[];
  onMarkerInteraction: (data: Partial<IPropertiesInteraction>) => void;
  onMouseLeave: () => void;
  propertiesInteraction: IPropertiesInteraction;
}

const VoltSearchResultsMap: FC<VoltSearchResultsMapProps> = ({ data, onMarkerInteraction, onMouseLeave, propertiesInteraction }) => {
  const [ref, setRef] = useState<MapBoX | null>(null);
  const [isImagesLoaded, setImagesLoaded] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const openPropertyDetails = useMemo(
    () => data.find((el) => el.id === propertiesInteraction.popup?.openId),
    [data, propertiesInteraction.popup]
  );

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
      setImagesLoaded(true);
      const geoJsonInit: MapGeoJson = {
        type: "FeatureCollection",
        features: [],
      };
      data.forEach((el) => {
        geoJsonInit.features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [el.lon, el.lat],
          },
          properties: {
            id: el.id.toString(),
            parcelNumberNoFormatting: el.parcelNumberNoFormatting,
            parcelNumber: el.parcelNumberNoFormatting,
            lng: el.lon,
            lat: el.lat,
            type: "selling",
            markerIcon: data.length === 1 ? "green-highlighted-default" : "green-default",
            hoveredMarkerIcon: "green-highlighted-default",
            selectedMarkerIcon: "green-highlighted-default",
            markerSize: 1,
            hoveredMarkerSize: 1,
            selectedMarkerSize: 1,
            acreage: el.acreage,
            polygonLineColor: "#05471C",
            polygonFillColor: "#05471C",
          },
        });
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

      ref.addLayer({
        id: mapData.layers.markersLayer,
        type: "symbol",
        source: mapData.sources.markersSource,
        layout: {
          "icon-image": "{markerIcon}",
          "icon-size": ["get", "markerSize"],
          "icon-allow-overlap": true,
        },
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

      const features = turf.points([...data.map((el) => [el.lon, el.lat])]);

      const center = turf.center(features);
      ref.setCenter(center.geometry.coordinates as any);
      ref.setZoom(8);
      ref.setZoom(8);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addMarkerImages, ref]);

  const openPopup = useCallback(
    ({ lat, lng }: { lng: number; lat: number }) => {
      if (ref && isImagesLoaded) {
        const popup = ref._popups[0];
        if (popup) {
          popup.setLngLat([lng, lat]);
        } else {
          new Popup({
            closeButton: false,
            className: "[&>div:last-child]:rounded-xl [&>div:last-child]:shadow-5 [&>div:last-child]:p-3 tooltip",
            closeOnClick: data.length > 1,
            closeOnMove: false,
            offset: [0, -20],
          })
            .on("close", () => {
              onMarkerInteraction({ popup: null });
            })
            .setLngLat([lng, lat])
            .setDOMContent(tooltipRef.current!)
            .setMaxWidth("max-content")
            .addTo(ref);
        }
      }
    },

    [data.length, isImagesLoaded, onMarkerInteraction, ref]
  );

  const handleMarkerInteraction = useCallback(() => {
    if (!isImagesLoaded) {
      return;
    }
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

      if (feature) {
        onMarkerInteraction({
          popup: { clickId: feature.id, isBulked: !!feature.bulkId, openId: feature.bulkId ? feature.bulkId : feature.id },
        });
      }
    });
  }, [isImagesLoaded, onMarkerInteraction, onMouseLeave, ref]);

  const highlightMarkers = useCallback(() => {
    if (!ref || !ref.getLayer(mapData.layers.markersLayer) || !isImagesLoaded) return;
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

    if (list.length) {
      const markerIconFilters = list.map((el) => {
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
  }, [isImagesLoaded, propertiesInteraction.hover, propertiesInteraction.popup, ref]);

  useEffect(() => {
    setInitialData();
  }, [setInitialData]);

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
    if (openPropertyDetails && ref) {
      openPopup({ lat: openPropertyDetails.lat, lng: openPropertyDetails.lon });
    } else {
      ref?._popups.forEach((x) => {
        x.remove();
      });
    }
  }, [openPopup, openPropertyDetails, ref]);

  return (
    <>
      <div style={{ display: "none" }}>
        <div ref={tooltipRef}>
          {openPropertyDetails && (
            <ul className="">
              <>
                <li className="text-xs text-grey-800 py-0.5">
                  Parcel Number <span className="text-black font-semibold">{openPropertyDetails.parcelNumberNoFormatting}</span>
                </li>
                <li className="text-xs text-grey-800 py-0.5">
                  Owner <span className="text-black font-semibold">{openPropertyDetails.owner}</span>
                </li>
                <li className="text-xs text-grey-800 py-0.5">
                  Acreage <span className="text-black font-semibold">{openPropertyDetails.acreage}</span>
                </li>
                {data && data?.length > 1 && (
                  <Button
                    className="py-1 h-auto !px-6 ml-auto flex mt-4"
                    onClick={() => {
                      if (openPropertyDetails.id === propertiesInteraction.popup?.openId) {
                        onMarkerInteraction({ popup: null });
                      } else {
                        onMarkerInteraction({
                          popup: {
                            clickId: openPropertyDetails.id.toString(),
                            openId: openPropertyDetails.id.toString(),
                            isBulked: false,
                          },
                        });
                      }
                    }}
                  >
                    {openPropertyDetails.id === propertiesInteraction.popup?.openId ? "Remove" : "Select"}
                  </Button>
                )}
              </>
            </ul>
          )}
        </div>
      </div>
      <Suspense fallback={<div className="w-full h-[full] bg-primary-main-800 animate-pulse" />}>
        <Map setRef={setRef} ref={ref} />
      </Suspense>
    </>
  );
};

export default VoltSearchResultsMap;
