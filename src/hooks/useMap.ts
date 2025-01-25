"use client";

import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { GeoJSONFeature, Map as MapBoX, Popup } from "mapbox-gl";
import { createMarkerImage } from "@/lib/map";
import { MapGeoJson } from "@/types/mapbox";

const MAP_ITEMS_IDS = {
  markersSourceId: "markers",
  markersLayerId: "markers-layer",
  markersClusterId: "markers-cluster",
  markersClusterCountId: "markers-cluster-count",
  polygonsOutlineLayerId: "polygons-outline-layer-id",
  polygonsFillLayerId: "polygons-fill-layer-id",
};

const useMap = () => {
  const [ref, setRef] = useState<MapBoX | null>(null);

  const geoJson = useRef<MapGeoJson>({
    type: "FeatureCollection",
    features: [],
  });

  const setGeoJson = useCallback((data: MapGeoJson) => {
    geoJson.current = data;
  }, []);

  const addMarkerImages = useCallback(
    (data: Record<string, string>) => {
      if (ref) {
        Object.keys(data).forEach((key) => {
          const img = createMarkerImage(data[key]);
          img.onload = (e) => {
            ref.addImage(key, img);
          };
        });
      }
    },
    [ref]
  );

  const showMarkers = useCallback(
    ({
      onMarkerMouseEnter,
      onMarkerMouseLeave,
      cluster,
      onClick,
    }: {
      onMarkerMouseEnter: (parcelNumberNoFormatting: string) => void;
      onMarkerMouseLeave: () => void;
      onClick: (parcelNumberNoFormatting: string) => void;
      cluster?: boolean;
    }) => {
      if (!ref) return;
      ref.addSource(MAP_ITEMS_IDS.markersSourceId, {
        type: "geojson",
        data: geoJson.current,
        generateId: true,
        ...(cluster && {
          cluster: true,
          clusterMaxZoom: 12,
          clusterRadius: 50,
        }),
      });

      ref.addLayer({
        id: MAP_ITEMS_IDS.markersLayerId,
        type: "symbol",
        source: MAP_ITEMS_IDS.markersSourceId,
        layout: {
          "icon-image": "{markerIcon}",
          "icon-size": ["get", "markerSize"],
          "icon-allow-overlap": true,
        },
      });

      if (cluster) {
        ref.addLayer({
          id: MAP_ITEMS_IDS.markersClusterId,
          type: "circle",
          source: MAP_ITEMS_IDS.markersSourceId,
          filter: ["has", "point_count"],
          paint: {
            // Use step expressions (https://docs.mapbox.com/style-spec/reference/expressions/#step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            "circle-color": ["step", ["get", "point_count"], "#51bbd6", 100, "#f1f075", 750, "#f28cb1"],
            "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
          },
        });

        ref.addLayer({
          id: MAP_ITEMS_IDS.markersClusterCountId,
          type: "symbol",
          source: MAP_ITEMS_IDS.markersSourceId,
          filter: ["has", "point_count"],
          layout: {
            "text-field": ["get", "point_count_abbreviated"],
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
        });
      }

      ref.on("mousemove", MAP_ITEMS_IDS.markersLayerId, (e) => {
        const feature = ref.queryRenderedFeatures(e.point)[0];
        const properties = feature.properties as MapGeoJson["features"][0]["properties"];
        if (properties) {
          onMarkerMouseEnter(properties.bulkId ? properties.bulkId : properties.parcelNumberNoFormatting);
        }
      });
      ref.on("mouseleave", MAP_ITEMS_IDS.markersLayerId, (e) => {
        onMarkerMouseLeave();
      });

      ref.on("click", MAP_ITEMS_IDS.markersLayerId, (e) => {
        const feature = ref.queryRenderedFeatures(e.point)[0];
        const properties = feature.properties as MapGeoJson["features"][0]["properties"];
        if (properties) {
          onClick(properties.bulkId ? properties.bulkId : properties.parcelNumberNoFormatting);
        }
      });
    },
    [ref]
  );

  const highlightFeatures = useCallback(
    (data: Array<{ [key: string]: "default" | "hovered" | "selected" }>) => {
      if (!ref || !ref.getLayer(MAP_ITEMS_IDS.markersLayerId)) {
        return;
      }

      if (data.length > 0) {
        const markerIconFilters = data.map((el) => {
          const [key, value] = [Object.keys(el)[0], Object.values(el)[0]];
          // eslint-disable-next-line no-nested-ternary
          const markerType = value === "default" ? "markerSize" : value === "hovered" ? "hoveredMarkerIcon" : "selectedMarkerIcon";

          return [
            ["==", ["get", "parcelNumberNoFormatting"], key],
            ["get", markerType],
          ];
        });

        ref.setLayoutProperty(MAP_ITEMS_IDS.markersLayerId, "icon-image", [
          "case",
          ...markerIconFilters.flat(),
          ["get", "markerIcon"], // Otherwise, use default icon
        ]);

        const markerSizeFilters = data.map((el) => {
          const [key, value] = [Object.keys(el)[0], Object.values(el)[0]];
          // eslint-disable-next-line no-nested-ternary
          const markerSize = value === "default" ? "markerSize" : value === "hovered" ? "hoveredMarkerSize" : "selectedMarkerSize";

          return [
            ["==", ["get", "parcelNumberNoFormatting"], key],
            ["get", markerSize],
          ];
        });

        ref.setLayoutProperty(MAP_ITEMS_IDS.markersLayerId, "icon-size", [
          "case",
          ...markerSizeFilters.flat(),
          ["get", "markerSize"], // Otherwise, use default icon
        ]);
      } else {
        ref.setLayoutProperty(MAP_ITEMS_IDS.markersLayerId, "icon-image", ["get", "markerIcon"]);
        ref.setLayoutProperty(MAP_ITEMS_IDS.markersLayerId, "icon-size", ["get", "markerSize"]);
      }
    },
    [ref]
  );

  const openPopup = useCallback(
    ({ lat, lng, popupRef, onClose }: { lng: number; lat: number; popupRef: any; onClose: () => void }) => {
      if (ref) {
        new Popup({ closeButton: false, className: "[&>div:last-child]:rounded-xl [&>div:last-child]:shadow-4 [&>div:last-child]:p-3" })
          .setLngLat([lng, lat])
          .setDOMContent(popupRef)
          .addTo(ref)
          .on("close", () => {
            onClose();
          });
      }
    },

    [ref]
  );

  const showRegridTiles = useCallback(
    async ({
      onMarkerMouseEnter,
      onMarkerMouseLeave,
      onClick,
    }: {
      onMarkerMouseEnter: (parcelNumberNoFormatting: string) => void;
      onMarkerMouseLeave: () => void;
      onClick: (parcelNumberNoFormatting: string) => void;
    }) => {
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
            ],
          },
        }),
      });
      const parcelCreateData = await createTiles.json();
      ref.addSource(parcelCreateData.id, {
        type: "vector",
        tiles: parcelCreateData.vector,
        promoteId: "fid",
      });

      const lineColorFilters = geoJson.current.features.map((el) => [
        ["==", ["get", "parcelnumb_no_formatting"], el.properties.parcelNumberNoFormatting],
        el.properties.polygonLineColor,
      ]);

      ref.addLayer(
        {
          id: MAP_ITEMS_IDS.polygonsOutlineLayerId,
          type: "line",
          source: parcelCreateData.id,
          "source-layer": parcelCreateData.id,
          minzoom: 12,
          maxzoom: 20,
          paint: {
            "line-color": ["case", ...lineColorFilters.flat(), "#649d8d"],
          },
        },
        "markers-layer"
      );

      const fillColorFilters = geoJson.current.features.map((el) => [
        ["==", ["get", "parcelnumb_no_formatting"], el.properties.parcelNumberNoFormatting],
        el.properties.polygonFillColor,
      ]);

      const fillColorOpacity = geoJson.current.features.map((el) => [
        ["==", ["get", "parcelnumb_no_formatting"], el.properties.parcelNumberNoFormatting],
        0.2,
      ]);

      ref.addLayer(
        {
          id: MAP_ITEMS_IDS.polygonsFillLayerId,
          type: "fill",
          source: parcelCreateData.id,
          "source-layer": parcelCreateData.id,
          minzoom: 12,
          maxzoom: 20,
          paint: {
            "fill-color": ["case", ...fillColorFilters.flat(), "transparent"],
            "fill-opacity": ["case", ...fillColorOpacity.flat(), 0],
          },
        },
        "markers-layer"
      );

      ref.on("mousemove", MAP_ITEMS_IDS.polygonsFillLayerId, (e) => {
        const polygonFeature = ref.queryRenderedFeatures(e.point)[0];
        const parcelNumberNoFormatting = polygonFeature?.properties?.parcelnumb_no_formatting;
        if (parcelNumberNoFormatting) {
          const feature = ref.queryRenderedFeatures({
            filter: ["==", ["get", "parcelNumberNoFormatting"], parcelNumberNoFormatting],
          })[0] as any;
          if (feature) {
            const featureParcelNumberNoFormatting = feature.properties.bulkId
              ? feature.properties.bulkId
              : feature.properties.parcelNumberNoFormatting;
            onMarkerMouseEnter(featureParcelNumberNoFormatting);
          } else {
            onMarkerMouseLeave();
          }
        }
      });

      ref.on("click", MAP_ITEMS_IDS.polygonsFillLayerId, (e) => {
        const feature = ref.queryRenderedFeatures(e.point)[0];
        const properties = feature.properties as MapGeoJson["features"][0]["properties"];
        if (properties && feature.layer?.id !== "markers-layer") {
          e.preventDefault();
          console.log(properties, "REGRID");
          // onClick(properties.bulkId ? properties.bulkId : properties.parcelNumberNoFormatting);
        }
      });

      ref.on("click", MAP_ITEMS_IDS.markersLayerId, (e) => {
        const feature = ref.queryRenderedFeatures(e.point)[0];
        const properties = feature.properties as MapGeoJson["features"][0]["properties"];
        if (properties) {
          onClick(properties.bulkId ? properties.bulkId : properties.parcelNumberNoFormatting);
        }
      });
    },
    [ref]
  );

  return {
    ref,
    setRef,
    setGeoJson,
    addMarkerImages,
    showMarkers,
    highlightFeatures,
    showRegridTiles,
    openPopup,
    geoJson: geoJson.current,
    loaded: false,
  };
};

export default useMap;
