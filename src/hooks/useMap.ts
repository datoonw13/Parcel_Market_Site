"use client";

import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { GeoJSONFeature, Map as MapBoX } from "mapbox-gl";
import { IUserRecentSearches } from "@/types/user";
import { FeatureCollection } from "geojson";
import { MapInteractionModel } from "@/types/common";

interface IInitiateMap {
  parcelNumberNoFormatting: string;
  owner: string;
  lng: number;
  lat: number;
  coordinates: any;
  acreage: number;
  properties: IUserRecentSearches["propertiesUsedForCalculation"];
}

export enum PropertyTypeEnum {
  primary,
  secondary,
  tertiary,
}
interface IBaseFeature {
  type: PropertyTypeEnum;
  parcelNumber: string;
  acreage: number;
  icon?: string;
  iconSelected?: string;
}

interface IPrimaryFeature extends IBaseFeature {
  type: PropertyTypeEnum.primary;
  owner: string;
  coordinates: any;
  lat: number;
  lng: number;
  lastSaleDate?: Date;
  lastSalePrice?: Date;
  pricePerAcreage?: number;
}

interface ISecondaryFeature extends IBaseFeature {
  type: PropertyTypeEnum.secondary;
  lat: number;
  lng: number;
  lastSaleDate: Date;
  lastSalePrice: number;
  pricePerAcreage: number;
  bulkId?: string;
}

interface ITertiaryFeature extends IBaseFeature {
  type: PropertyTypeEnum.tertiary;
  lat: number;
  lng: number;
  bulkId?: string;
  lastSaleDate: Date;
  lastSalePrice: number;
  pricePerAcreage: number;
}

export type IFeature = IPrimaryFeature | ISecondaryFeature | ITertiaryFeature;

const markerImages = {
  primary: {
    url: "/map/primary.svg",
  },
  primaryHighlighted: {
    url: "/map/primary-highlighted.svg",
  },
  secondary: {
    url: "/map/secondary.svg",
  },
  secondaryHighlighted: {
    url: "/map/secondary-highlighted.svg",
  },
  active: {
    url: "/map/active.svg",
  },
};

const createMarkerImage = (type: keyof typeof markerImages) => {
  const el = document.createElement("img");
  el.src = `${markerImages[type].url}`;
  return el;
};

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

  const hoveredFeatureParcelNumber = useRef<string | null>(null);

  const initiateMap = useCallback(
    (data: IInitiateMap) => {
      if (!ref || !loaded) {
        return;
      }

      geoJson.current.features.push({
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: data.coordinates,
        },
        properties: {
          type: PropertyTypeEnum.primary,
          parcelNumber: data.parcelNumberNoFormatting,
          owner: data.owner,
          coordinates: data.coordinates,
          lat: data.lat,
          lng: data.lng,
          acreage: data.acreage,
        },
      });
      geoJson.current.features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [data.lng, data.lat],
        },
        properties: {
          type: PropertyTypeEnum.primary,
          parcelNumber: data.parcelNumberNoFormatting,
          owner: data.owner,
          coordinates: [data.lng, data.lat],
          lat: data.lat,
          lng: data.lng,
          icon: "active",
          iconSelected: "active",
          acreage: data.acreage,
        },
      });

      data.properties
        .filter((el) => {
          if (el.isBulked) {
            return !el.data.parcelNumberNoFormatting.split("multiple").includes(data.parcelNumberNoFormatting);
          }
          return el.data.parcelNumberNoFormatting !== data.parcelNumberNoFormatting;
        })
        .forEach((property) => {
          if (property.isBulked) {
            property.data.properties.forEach((childProperty) => {
              geoJson.current.features.push({
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [childProperty.lon, childProperty.lat],
                },
                properties: {
                  type: childProperty.isMedianValid ? PropertyTypeEnum.secondary : PropertyTypeEnum.tertiary,
                  parcelNumber: childProperty.parcelNumberNoFormatting,
                  lat: childProperty.lat,
                  lng: childProperty.lon,
                  bulkId: property.data.parcelNumberNoFormatting,
                  lastSaleDate: childProperty.lastSaleDate,
                  lastSalePrice: childProperty.lastSalePrice,
                  pricePerAcreage: childProperty.pricePerAcreage,
                  icon: childProperty.isMedianValid ? "primary" : "secondary",
                  iconSelected: childProperty.isMedianValid ? "primaryHighlighted" : "secondaryHighlighted",
                  acreage: childProperty.acreage,
                },
              });
            });
          } else {
            geoJson.current.features.push({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [property.data.lon, property.data.lat],
              },
              properties: {
                type: property.data.isMedianValid ? PropertyTypeEnum.secondary : PropertyTypeEnum.tertiary,
                parcelNumber: property.data.parcelNumberNoFormatting,
                lat: property.data.lat,
                lng: property.data.lon,
                lastSaleDate: property.data.lastSaleDate,
                lastSalePrice: property.data.lastSalePrice,
                pricePerAcreage: property.data.pricePerAcreage,
                icon: property.data.isMedianValid ? "primary" : "secondary",
                iconSelected: property.data.isMedianValid ? "primaryHighlighted" : "secondaryHighlighted",
                acreage: property.data.acreage,
              },
            });
          }
        });

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

      ref.addLayer({
        id: "properties-layer-selected",
        type: "symbol",
        source: "properties",
        layout: {
          "icon-image": "{iconSelected}",
          "icon-allow-overlap": true,
          "icon-size": 1.5,
        },
        paint: {
          "icon-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 1, 0],
        },
      });

      ref.on("mousemove", "properties-layer", (e) => {
        const feature = ref.queryRenderedFeatures(e.point).filter((el) => el.source === "properties")[0];
        const featureProperties: IFeature = feature.properties as any;

        if (
          featureProperties &&
          (featureProperties.type === PropertyTypeEnum.secondary || featureProperties.type === PropertyTypeEnum.tertiary)
        ) {
          setMapInteraction &&
            setMapInteraction((prev) => ({
              ...prev,
              hoveredParcelNumber: featureProperties.bulkId || featureProperties.parcelNumber,
            }));
        }
      });

      ref.on("mouseleave", "properties-layer", (e) => {
        setMapInteraction &&
          setMapInteraction((prev) => ({
            ...prev,
            hoveredParcelNumber: null,
          }));
      });

      ref.on("click", "properties-layer", (e) => {
        const feature = ref.queryRenderedFeatures(e.point).filter((el) => el.source === "properties")[0];
        if (onMarkerClick) {
          onMarkerClick(feature, ref);
        }
      });
    },
    [loaded, onMarkerClick, ref, setMapInteraction]
  );

  const handleMarkerHover = useCallback(() => {
    if (!ref || !mapInteraction || !loaded) {
      return;
    }

    if (mapInteraction.hoveredParcelNumber) {
      // first reset prev features
      if (hoveredFeatureParcelNumber.current) {
        const features = ref.querySourceFeatures("properties", {
          filter: [
            "in",
            hoveredFeatureParcelNumber.current.includes("multiple") ? "bulkId" : "parcelNumber",
            hoveredFeatureParcelNumber.current,
          ],
        });
        features.forEach((feature) => {
          ref.setFeatureState({ source: "properties", id: feature.id! }, { hover: false });
        });
      }

      // update hover features state
      hoveredFeatureParcelNumber.current = mapInteraction.hoveredParcelNumber;
      if (hoveredFeatureParcelNumber.current) {
        const features = ref.querySourceFeatures("properties", {
          filter: [
            "in",
            hoveredFeatureParcelNumber.current.includes("multiple") ? "bulkId" : "parcelNumber",
            hoveredFeatureParcelNumber.current,
          ],
        });
        features.forEach((feature) => {
          ref.setFeatureState({ source: "properties", id: feature.id! }, { hover: true });
        });
      }
    }
    if (!mapInteraction.hoveredParcelNumber && hoveredFeatureParcelNumber.current) {
      const features = ref.querySourceFeatures("properties", {
        filter: [
          "in",
          hoveredFeatureParcelNumber.current.includes("multiple") ? "bulkId" : "parcelNumber",
          hoveredFeatureParcelNumber.current,
        ],
      });
      features.forEach((feature) => {
        ref.setFeatureState({ source: "properties", id: feature.id! }, { hover: false });
      });
      hoveredFeatureParcelNumber.current = null;
    }
  }, [loaded, mapInteraction, ref]);

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
  };
};

export default useMap;
