"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LngLat, LngLatLike, Map as MapBoX, Marker, Source, Layer, Popup } from "mapbox-gl";
import { IUserRecentSearches } from "@/types/user";
import { Feature, GeoJsonProperties, Geometry, Polygon, Position } from "geojson";
import { swapPolygonCoordinates } from "@/lib/utils";
import { MapInteractionModel } from "@/types/common";

interface IAddPropertyData {
  centerCoordinate: { lng: number; lat: number };
  polygonCoordinates?: Polygon["coordinates"];
  parcelNumber: string;
  type: "selling-property" | "used-for-calculation" | "additional-data";
  iconType: keyof typeof markerImages;
  onClick?: (marker: Marker) => void;
  onMouseEnter?: (marker: Marker) => void;
  onMouseLeave?: (marker: Marker) => void;
}

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

const useMap = (markerIcons?: Array<typeof markerImages.primary>) => {
  const [ref, setRef] = useState<MapBoX | null>(null);
  const [loaded, setLoaded] = useState(false);
  const selectedFeatureId = useRef<Array<string | number>>([]);

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
    selectedFeatureId,
  };
};

export default useMap;
