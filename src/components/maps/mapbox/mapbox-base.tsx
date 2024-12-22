"use client";

import { FC, memo, useCallback, useEffect, useRef } from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY || "";

interface MapboxBaseProps {
  style?: string;
  center?: LngLatLike;
  zoom?: number;
  setRef: (ref: mapboxgl.Map | null) => void;
  ref: mapboxgl.Map | null;
}

const MapboxBase: FC<MapboxBaseProps> = (props) => {
  const { center, style, zoom, setRef, ref } = props;
  const mapContainerRef = useRef(null);
  console.log("reree");

  const initializeMap = useCallback(() => {
    if (mapContainerRef.current) {
      setRef(
        new mapboxgl.Map({
          container: mapContainerRef.current,
          style: style || "mapbox://styles/mapbox/streets-v11",
          center: center || [-97.7431, 30.2672],
          zoom: zoom || 3.5,
          dragRotate: false,
        })
      );
    }
  }, [center, setRef, style, zoom]);

  useEffect(() => {
    initializeMap();
    return () => {
      ref?.remove();
      setRef(null);
    };
  }, [initializeMap, ref, setRef]);

  return <div className="map-container w-full h-full" ref={mapContainerRef} />;
};

export default memo(MapboxBase);
