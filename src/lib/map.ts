import { IFeature, IInitiateMap, PropertyTypeEnum } from "@/types/mapbox";
import { FeatureCollection } from "geojson";
import { useRef } from "react";

export const markerImages = {
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

export const createMarkerImage = (type: keyof typeof markerImages) => {
  const el = document.createElement("img");
  el.src = `${markerImages[type].url}`;
  return el;
};

export const getGeoJson = (data: IInitiateMap) => {
  const geoJson: FeatureCollection<FeatureCollection["features"][0]["geometry"], IFeature> = {
    type: "FeatureCollection",
    features: [],
  };

  geoJson.features.push({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [data.lng, data.lat],
    },
    properties: {
      type: PropertyTypeEnum.primary,
      parcelNumberNoFormatting: data.parcelNumberNoFormatting,
      owner: data.owner,
      lat: data.lat,
      lng: data.lng,
      icon: "active",
      iconSelected: "active",
      acreage: data.acreage,
    },
  });

  data.properties.forEach((feature) => {
    if (feature.type === PropertyTypeEnum.primary) {
    } else {
      geoJson.features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [feature.lng, feature.lat],
        },
        properties: {
          type: feature.type,
          parcelNumberNoFormatting: feature.parcelNumberNoFormatting,
          lat: feature.lat,
          lng: feature.lng,
          bulkId: feature.bulkId,
          lastSaleDate: feature.lastSaleDate,
          lastSalePrice: feature.lastSalePrice,
          pricePerAcreage: feature.pricePerAcreage,
          icon: feature.type === PropertyTypeEnum.secondary ? "primary" : "secondary",
          iconSelected: feature.type === PropertyTypeEnum.secondary ? "primaryHighlighted" : "secondaryHighlighted",
          acreage: feature.acreage,
        },
      });
    }
  });

  // Remove selling property from properties
  geoJson.features.filter(
    (feature) =>
      (feature as any).type !== PropertyTypeEnum.primary && feature.properties.parcelNumberNoFormatting === data.parcelNumberNoFormatting
  );

  return geoJson;
};
