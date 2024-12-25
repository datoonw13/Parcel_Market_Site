"use client";

import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { GeoJSONFeature, Map as MapBoX } from "mapbox-gl";
import { FeatureCollection } from "geojson";
import { MapInteractionModel } from "@/types/common";
import { createMarkerImage, getGeoJson, markerImages } from "@/lib/map";
import { IFeature, IInitiateMap, PropertyTypeEnum } from "@/types/mapbox";

const useMap = ({
  markerIcons,
  setMapInteraction,
  mapInteraction,
  onMarkerClick,
}: {
  markerIcons?: Array<typeof markerImages.primary>;
  setMapInteraction?: Dispatch<SetStateAction<MapInteractionModel>>;
  mapInteraction?: MapInteractionModel;
  onMarkerClick: (data: GeoJSONFeature, ref: MapBoX) => void;
}) => {
  const [ref, setRef] = useState<MapBoX | null>(null);
  const [loaded, setLoaded] = useState(false);
  const geoJson = useRef<FeatureCollection<FeatureCollection["features"][0]["geometry"], IFeature>>({
    type: "FeatureCollection",
    features: [],
  });

  const hoveredMarkerParcelNumber = useRef<string | null>(null);

  const setGeoJson = useCallback((data: IInitiateMap) => {
    geoJson.current = getGeoJson(data);
  }, []);

  const addMarkers = useCallback(() => {
    if (!ref) return;
    ref.addSource("properties", {
      type: "geojson",
      data: geoJson.current,
      generateId: true,
    });

    ref.addLayer({
      id: "polygons-main",
      type: "fill",
      source: "properties",
      layout: {},
      paint: {
        "fill-color": "#F44D61",
        "fill-opacity": 0.2,
      },
    });

    ref.addLayer({
      id: "polygons-outline",
      type: "line",
      source: "properties",
      layout: {},
      paint: {
        "line-color": "rgba(244, 77, 97, 1)",
        "line-width": 2,
      },
    });

    ref.addLayer({
      id: "properties-layer",
      type: "symbol",
      source: "properties",
      layout: {
        "icon-image": "{icon}",
        "icon-size": [
          "match",
          ["get", "type"],
          [PropertyTypeEnum.primary],
          1.5,
          [PropertyTypeEnum.secondary],
          1,
          [PropertyTypeEnum.tertiary],
          1,
          1.2,
        ],
        "icon-allow-overlap": true,
      },
      paint: {
        "icon-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0, 1],
      },
    });
  }, [ref]);

  const initiateMap = useCallback(
    (data: IInitiateMap, cb: (data: typeof geoJson.current) => void) => {
      if (!ref || !loaded) {
        return;
      }
      geoJson.current = getGeoJson(data);

      cb(geoJson.current);
      // if (data.coordinates) {
      //   geoJson.current.features.push({
      //     type: "Feature",
      //     geometry: {
      //       type: "Polygon",
      //       coordinates: data.coordinates,
      //     },
      //     properties: {
      //       type: PropertyTypeEnum.primary,
      //       parcelNumber: data.parcelNumberNoFormatting,
      //       owner: data.owner,
      //       coordinates: data.coordinates,
      //       lat: data.lat,
      //       lng: data.lng,
      //       acreage: data.acreage,
      //     },
      //   });
      // }
      // geoJson.current.features.push({
      //   type: "Feature",
      //   geometry: {
      //     type: "Point",
      //     coordinates: [data.lng, data.lat],
      //   },
      //   properties: {
      //     type: PropertyTypeEnum.primary,
      //     parcelNumber: data.parcelNumberNoFormatting,
      //     owner: data.owner,
      //     coordinates: [data.lng, data.lat],
      //     lat: data.lat,
      //     lng: data.lng,
      //     icon: "active",
      //     iconSelected: "active",
      //     acreage: data.acreage,
      //   },
      // });

      // data.properties
      //   .filter((el) => {
      //     if (el.isBulked) {
      //       return !el.data.parcelNumberNoFormatting.split("multiple").includes(data.parcelNumberNoFormatting);
      //     }
      //     return el.data.parcelNumberNoFormatting !== data.parcelNumberNoFormatting;
      //   })
      //   .forEach((property) => {
      //     if (property.isBulked) {
      //       property.data.properties.forEach((childProperty) => {
      //         geoJson.current.features.push({
      //           type: "Feature",
      //           geometry: {
      //             type: "Point",
      //             coordinates: [childProperty.lon, childProperty.lat],
      //           },
      //           properties: {
      //             type: childProperty.isMedianValid ? PropertyTypeEnum.secondary : PropertyTypeEnum.tertiary,
      //             parcelNumber: childProperty.parcelNumberNoFormatting,
      //             lat: childProperty.lat,
      //             lng: childProperty.lon,
      //             bulkId: property.data.parcelNumberNoFormatting,
      //             lastSaleDate: childProperty.lastSaleDate,
      //             lastSalePrice: childProperty.lastSalePrice,
      //             pricePerAcreage: childProperty.pricePerAcreage,
      //             icon: childProperty.isMedianValid ? "primary" : "secondary",
      //             iconSelected: childProperty.isMedianValid ? "primaryHighlighted" : "secondaryHighlighted",
      //             acreage: childProperty.acreage,
      //           },
      //         });
      //       });
      //     } else {
      //       geoJson.current.features.push({
      //         type: "Feature",
      //         geometry: {
      //           type: "Point",
      //           coordinates: [property.data.lon, property.data.lat],
      //         },
      //         properties: {
      //           type: property.data.isMedianValid ? PropertyTypeEnum.secondary : PropertyTypeEnum.tertiary,
      //           parcelNumber: property.data.parcelNumberNoFormatting,
      //           lat: property.data.lat,
      //           lng: property.data.lon,
      //           lastSaleDate: property.data.lastSaleDate,
      //           lastSalePrice: property.data.lastSalePrice,
      //           pricePerAcreage: property.data.pricePerAcreage,
      //           icon: property.data.isMedianValid ? "primary" : "secondary",
      //           iconSelected: property.data.isMedianValid ? "primaryHighlighted" : "secondaryHighlighted",
      //           acreage: property.data.acreage,
      //         },
      //       });
      //     }
      //   });

      // ref.addSource("properties", {
      //   type: "geojson",
      //   data: geoJson.current,
      //   generateId: true,
      // });

      // ref.addLayer({
      //   id: "polygons-main",
      //   type: "fill",
      //   source: "properties",
      //   layout: {},
      //   paint: {
      //     "fill-color": "#F44D61",
      //     "fill-opacity": 0.2,
      //   },
      // });

      // ref.addLayer({
      //   id: "polygons-outline",
      //   type: "line",
      //   source: "properties",
      //   layout: {},
      //   paint: {
      //     "line-color": "rgba(244, 77, 97, 1)",
      //     "line-width": 2,
      //   },
      // });

      // ref.addLayer({
      //   id: "properties-layer",
      //   type: "symbol",
      //   source: "properties",
      //   layout: {
      //     "icon-image": "{icon}",
      //     "icon-size": [
      //       "match",
      //       ["get", "type"],
      //       [PropertyTypeEnum.primary],
      //       1.5,
      //       [PropertyTypeEnum.secondary],
      //       1,
      //       [PropertyTypeEnum.tertiary],
      //       1,
      //       1.2,
      //     ],
      //     "icon-allow-overlap": true,
      //   },
      //   paint: {
      //     "icon-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0, 1],
      //   },
      // });

      // ref.addLayer({
      //   id: "properties-layer-selected",
      //   type: "symbol",
      //   source: "properties",
      //   layout: {
      //     "icon-image": "{iconSelected}",
      //     "icon-allow-overlap": true,
      //     "icon-size": 1.5,
      //   },
      //   paint: {
      //     "icon-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 1, 0],
      //   },
      // });

      // ref.on("mousemove", "properties-layer", (e) => {
      //   const feature = ref.queryRenderedFeatures(e.point).filter((el) => el.source === "properties")[0];
      //   const featureProperties: IFeature = feature.properties as any;
      //   if (
      //     featureProperties &&
      //     (featureProperties.type === PropertyTypeEnum.secondary || featureProperties.type === PropertyTypeEnum.tertiary)
      //   ) {
      //     setMapInteraction &&
      //       setMapInteraction((prev) => ({
      //         ...prev,
      //         hoveredParcelNumber: featureProperties.bulkId || featureProperties.parcelNumberNoFormatting,
      //       }));
      //   }
      // });

      // ref.on("mouseleave", "properties-layer", (e) => {
      //   setMapInteraction &&
      //     setMapInteraction((prev) => ({
      //       ...prev,
      //       hoveredParcelNumber: null,
      //     }));
      // });

      // ref.on("click", "properties-layer", (e) => {
      //   const feature = ref.queryRenderedFeatures(e.point).filter((el) => el.source === "properties")[0];
      //   if (onMarkerClick) {
      //     onMarkerClick(feature, ref);
      //   }
      // });
    },
    [loaded, onMarkerClick, ref, setMapInteraction]
  );

  const handleMarkerHover = useCallback(() => {
    if (!ref || !mapInteraction || !loaded) {
      return;
    }

    if (mapInteraction.hoveredParcelNumber) {
      // first reset prev features
      if (hoveredMarkerParcelNumber.current) {
        const features = ref.querySourceFeatures("properties", {
          filter: [
            "in",
            hoveredMarkerParcelNumber.current.includes("multiple") ? "bulkId" : "parcelNumber",
            hoveredMarkerParcelNumber.current,
          ],
        });
        features.forEach((feature) => {
          ref.setFeatureState({ source: "properties", id: feature.id! }, { hover: false });
        });
      }

      // update hover features state
      hoveredMarkerParcelNumber.current = mapInteraction.hoveredParcelNumber;
      if (hoveredMarkerParcelNumber.current) {
        const features = ref.querySourceFeatures("properties", {
          filter: [
            "in",
            hoveredMarkerParcelNumber.current.includes("multiple") ? "bulkId" : "parcelNumber",
            hoveredMarkerParcelNumber.current,
          ],
        });
        features.forEach((feature) => {
          ref.setFeatureState({ source: "properties", id: feature.id! }, { hover: true });
        });
      }
    }
    if (!mapInteraction.hoveredParcelNumber && hoveredMarkerParcelNumber.current) {
      const features = ref.querySourceFeatures("properties", {
        filter: [
          "in",
          hoveredMarkerParcelNumber.current.includes("multiple") ? "bulkId" : "parcelNumber",
          hoveredMarkerParcelNumber.current,
        ],
      });
      features.forEach((feature) => {
        ref.setFeatureState({ source: "properties", id: feature.id! }, { hover: false });
      });
      hoveredMarkerParcelNumber.current = null;
    }
  }, [loaded, mapInteraction, ref]);

  const addRegridLayer = useCallback(async () => {
    if (!ref || loaded) {
      return;
    }

    const x = await fetch(`https://tiles.regrid.com/api/v1/sources?token=${process.env.NEXT_PUBLIC_REGRID_KEY}`, {
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
          ],
        },
      }),
    });
    const parcelCreateData = await x.json();

    ref
      .addSource(parcelCreateData.id, {
        type: "vector",
        tiles: parcelCreateData.vector,
        promoteId: "fid",
      })
      .on("click", (e) => {
        console.log(ref.queryRenderedFeatures(e.point));
      });

    const aa = geoJson.current.features.map((el) => [
      ["==", ["get", "parcelnumb_no_formatting"], el.properties.parcelNumberNoFormatting],
      el.properties.type === PropertyTypeEnum.secondary ? "green" : "yellow",
    ]);

    ref.addLayer({
      id: "parcels",
      type: "line",
      source: parcelCreateData.id,
      "source-layer": parcelCreateData.id,
      minzoom: 10,
      maxzoom: 20,
      layout: {
        visibility: "visible",
        "icon-image": "primary",
      },
      paint: {
        "line-color": ["case", ...aa.flat(), "red"],
      },
    });

    ref.addLayer({
      id: "parcel-assist",
      type: "fill",
      source: parcelCreateData.id,
      "source-layer": parcelCreateData.id,
      minzoom: 10,
      maxzoom: 20,
      layout: {
        visibility: "visible",
      },
      paint: {
        // "fill-color": ["case", ["==", ["get", "parcelnumb_no_formatting"], "10303502"], "blue", "red"],
        "fill-color": ["case", ...aa.flat(), "transparent"],
        "fill-opacity": 0.9,
      },
    });
    // ref.on("sourcedata", (e) => {
    //   console.log(e.target.queryRenderedFeatures(), 22);
    // });
    ref.on("mousemove", "parcels", (e) => {
      const feature = ref.queryRenderedFeatures(e.point);
    });
  }, [loaded, ref]);

  useEffect(() => {
    handleMarkerHover();
  }, [handleMarkerHover, ref]);

  useEffect(() => {
    if (ref) {
      ref.on("load", () => {
        setLoaded(true);
        Object.keys(markerIcons || markerImages).forEach((key) => {
          const img = createMarkerImage(key as keyof typeof markerImages);
          img.onload = (e) => {
            ref.addImage(key, img);
          };
        });
      });
    }
  }, [ref, markerIcons]);

  return {
    ref,
    setRef,
    loaded,
    initiateMap,
    addRegridLayer,
    setGeoJson,
    addMarkers
  };
};

export default useMap;
