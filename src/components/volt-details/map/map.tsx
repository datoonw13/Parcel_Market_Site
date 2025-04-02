/* eslint-disable no-underscore-dangle */

"use client";

import dynamic from "next/dynamic";
import { FC, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import { z } from "zod";
import { MapGeoJson } from "@/types/mapbox";
import { Map as MapBoX, Popup } from "mapbox-gl";
import { IPropertiesInteraction } from "@/types/volt";
import isMobile from "is-mobile";

const Map = dynamic(() => import("@/components/maps/mapbox/mapbox-base"), { ssr: false });

const mapData = {
  sources: {
    markersSource: "markersSource",
    mainLandPolygonSource: "mainLandPolygonSource",
  },
  layers: {
    markersLayer: "markersLayer",
    markerClusterCountLayer: "markers-cluster-count-layer",
    markerClusterLayer: "markers-cluster-layer",
    parcelsPolygon: "parcelsPolygon",
    parcelsPolygonAssist: "parcelsPolygonAssist",
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

  const setInitialData = useCallback(
    async ({ resetZoomAndCenter }: { resetZoomAndCenter?: boolean }) => {
      if (ref) {
        Object.values(mapData.layers).forEach((el) => {
          const layer = ref.getLayer(el);
          if (layer) {
            ref.removeLayer(layer.id);
          }
        });

        Object.values(mapData.sources).forEach((el) => {
          const source = ref.getSource(el);
          if (source) {
            ref.removeSource(el);
          }
        });

        window.map = ref;

        const mainLandBulkGroup = data.assessments.data.find((el) => el.isBulked && el.data.hasSellingProperty);
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
            price: data.voltPrice.formattedString,
            pricePerAcreage: data.voltPricePerAcreage.formattedString,
            polygonLineColor: "#05471C",
            polygonFillColor: "#05471C",
            bulkId: (mainLandBulkGroup?.isBulked && mainLandBulkGroup?.data.id) || null,
            isBulkMedianValid: mainLandBulkGroup?.data.isMedianValid,
            group: mainLandBulkGroup?.isBulked ? mainLandBulkGroup?.data.group : undefined,
          },
        });

        data.assessments.data.forEach((el) => {
          if (el.isBulked) {
            el.data.properties.forEach((childEl) => {
              if (childEl.id !== data.id && childEl.parcelNumber.formattedString !== data.parcelNumber.formattedString) {
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
          } else if (el.data.id !== data.id && el.data.parcelNumber.formattedString !== data.parcelNumber.formattedString) {
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

        // Markers
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
            if (property && property.properties.lng && property.properties.lat) {
              e.preventDefault();
              ref.setZoom(16);
              ref.setCenter([property.properties.lng, property.properties.lat]);
            }
          });

        // Main land polygon
        ref.addSource(mapData.sources.mainLandPolygonSource, {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: JSON.parse(data.coordinates),
            },
            properties: {},
          },
        });

        ref.addLayer(
          {
            id: mapData.layers.parcelsPolygon,
            type: "fill",
            source: mapData.sources.mainLandPolygonSource,
            layout: {},
            paint: {
              "fill-color": "#649d8d",
              "fill-opacity": 0.6,
            },
          },
          mapData.layers.markersLayer
        );

        ref.addLayer(
          {
            id: mapData.layers.parcelsPolygonAssist,
            type: "line",
            source: mapData.sources.mainLandPolygonSource,
            layout: {},
            paint: {
              "line-color": "#649d8d",
              "line-width": 2,
            },
          },
          mapData.layers.markersLayer
        );

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

        if (resetZoomAndCenter) {
          ref.setZoom(8);
          ref.setCenter([data.lon, data.lat]);
        }
      }
    },
    [
      data.acreage.formattedString,
      data.assessments.data,
      data.coordinates,
      data.id,
      data.lat,
      data.lon,
      data.parcelNumber.formattedString,
      data.voltPrice.formattedString,
      data.voltPricePerAcreage.formattedString,
      ref,
    ]
  );

  const showRegridTiles = useCallback(async () => {
    if (!ref) {
      return;
    }
    const createTiles = await fetch(`https://tiles.regrid.com/api/v1/sources?token=${process.env.NEXT_PUBLIC_REGRID_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: {
          parcel: true,
        },
        fields: {
          parcel: [
            "usedesc",
            "parcelnumb_no_formatting",
            "parcelnumb",
            "state2",
            "county",
            "city",
            "zoning_description",
            "owner",
            "lat",
            "lon",
            "gisacre",
            "ll_gisacre",
          ],
        },
      }),
    });
    const parcelCreateData = await createTiles.json();

    // Register the parcel source using the tile URL we just got
    if (ref.getLayer("parcels")) {
      ref.removeLayer("parcels");
    }
    if (ref.getLayer("parcel-assist")) {
      ref.removeLayer("parcel-assist");
    }
    if (ref.getLayer("polygon-labels")) {
      ref.removeLayer("polygon-labels");
    }
    if (ref.getSource(parcelCreateData.id)) {
      ref.removeSource(parcelCreateData.id);
    }
    ref.addSource(parcelCreateData.id, {
      type: "vector",
      tiles: parcelCreateData.vector,
      promoteId: "fid",
    });

    const layers = ref.getStyle()?.layers;
    let firstSymbolId;
    if (layers) {
      // eslint-disable-next-line no-restricted-syntax
      for (const layer of layers) {
        if (layer.type === "symbol") {
          firstSymbolId = layer.id;
          break;
        }
      }
    }

    ref.addLayer(
      {
        id: "parcels",
        type: "line",
        source: parcelCreateData.id,
        "source-layer": parcelCreateData.id,
        minzoom: 15,
        maxzoom: 21,
        layout: {
          visibility: "visible",
        },
        paint: {
          "line-color": "#649d8d",
          "line-width": 1.7,
        },
      },
      firstSymbolId
    );

    // We need a transparent but 'filled' helper layer to catch click events
    ref.addLayer(
      {
        id: "parcel-assist",
        type: "fill",
        source: parcelCreateData.id,
        "source-layer": parcelCreateData.id,
        minzoom: 15,
        maxzoom: 21,
        layout: {
          visibility: "visible",
        },
        paint: {
          "fill-color": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            "#649d8d", // Turns parcel green when clicked
            ["boolean", ["feature-state", "hover"], false],
            "#649d8d", // Turns green when hovered
            "#fff", // Default color
          ],
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            0.9, // Almost fully opaque when selected
            ["boolean", ["feature-state", "hover"], false],
            0.5, // Half transparent when hovered
            0.1, // Default color
          ],
        },
      },
      firstSymbolId
    );

    // show parcel num

    ref.addLayer(
      {
        id: "polygon-labels",
        type: "symbol",
        source: parcelCreateData.id,
        "source-layer": parcelCreateData.id,
        minzoom: 15,
        maxzoom: 21,
        layout: {
          "text-field": ["get", "owner"], // Ensure 'name' matches your GeoJSON property
          "text-size": 12,
          "text-offset": [0, 0.5],
          "text-anchor": "center",
        },
        paint: {
          "text-color": "#000000",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1,
        },
      },
      mapData.layers.markersLayer
    );
  }, [ref]);

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
    if (!isMobile()) {
      ref?.on("mousemove", mapData.layers.markersLayer, (e) => {
        const feature = ref.queryRenderedFeatures(e.point)[0].properties as MapGeoJson["features"][0]["properties"];
        if (feature) {
          onMarkerInteraction({
            hover: { clickId: feature.id, isBulked: !!feature.bulkId, openId: feature.bulkId ? feature.bulkId : feature.id },
          });
        }
      });
    }

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
    setInitialData({ resetZoomAndCenter: true });
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
    showRegridTiles();
  }, [showRegridTiles]);

  useEffect(() => {
    if (ref) {
      ref.on("style.load", () => {
        setInitialData({ resetZoomAndCenter: false });
        showRegridTiles();
      });
    }
  }, [ref, setInitialData, showRegridTiles]);

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
