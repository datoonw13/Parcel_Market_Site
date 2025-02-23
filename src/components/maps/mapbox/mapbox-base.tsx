"use client";

import { FC, memo, useCallback, useEffect, useRef } from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import usaOutline from "../../../../public/map/usa-outline.json";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY || "";

interface MapboxBaseProps {
  mapStyle?: string;
  center?: LngLatLike;
  zoom?: number;
  setRef: (ref: mapboxgl.Map | null) => void;
  ref: mapboxgl.Map | null;
}

const MapboxBase: FC<MapboxBaseProps> = (props) => {
  const { center, mapStyle, zoom, setRef, ref } = props;
  const mapContainerRef = useRef(null);

  const initializeMap = useCallback(() => {
    if (mapContainerRef.current) {
      const newRef = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: mapStyle || "mapbox://styles/mapbox/navigation-day-v1",
        center: center || [-97.7431, 30.2672],
        zoom: zoom || 3.5,
        dragRotate: false,
      });

      newRef?.on("load", () => {
        newRef!.addLayer({
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: usaOutline as any,
            lineMetrics: true,
          },
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "rgba(211, 34, 11, 1)",
            "line-width": {
              base: 1,
              stops: [
                [14, 3.5],
                [18, 20],
              ],
            },
            "line-dasharray": [0.1, 2],
          },
        });
        setRef(newRef);
      });
    }
  }, [center, setRef, mapStyle, zoom]);

  useEffect(() => {
    initializeMap();
    return () => {
      ref?.remove();
      setRef(null);
    };
  }, [initializeMap, ref, setRef]);

  return (
    <>
      <div className="map-container w-full h-full" ref={mapContainerRef} />
    </>
  );
};

export default memo(MapboxBase);
