import React, { useEffect, useState, useRef } from "react";
import mapboxgl, { MapMouseEvent } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import area from "@turf/area";
import { polygon, convertArea } from "@turf/helpers";

mapboxgl.accessToken = "pk.eyJ1IjoibXJ6aXBwbzEyMyIsImEiOiJjbTRqazMzZGEwaTZiMmxzaGw5bmwxazhlIn0.kU8XbKNSEtMyNoAifLqbEQ";

const MapboxComponent = () => {
  const hoveredFeaturePropertyId = useRef<null | number>(null);
  const mapContainerRef = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const handleMouseMove = (e: MapMouseEvent) => {
    const features = map.current!.queryRenderedFeatures(e.point, { layers: ["parcel-assist"] });

    if (features.length > 0) {
      const feature = features[0] as any;
      const { fid }: { fid: number } = feature.properties;

      if (hoveredFeaturePropertyId.current !== fid) {
        map.current!.setFeatureState(
          { source: "parcels", sourceLayer: "parcels", id: hoveredFeaturePropertyId.current! },
          { hover: false }
        );
        hoveredFeaturePropertyId.current = fid;

        map.current!.setFeatureState({ source: "parcels", sourceLayer: "parcels", id: hoveredFeaturePropertyId.current }, { hover: true });
        map.current!.triggerRepaint();
      }
    }
  };

  const initializeMap = () => {
    if (mapContainerRef.current) {
      map.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-97.7431, 30.2672],
        zoom: 3,
      });
    }

    if (map.current) {
      map.current.on("load", async () => {
        const parcelCreate = await fetch(
          `https://tiles.regrid.com/api/v1/parcels?format=mvt&token=eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJyZWdyaWQuY29tIiwiaWF0IjoxNzMzNjgyNTcyLCJleHAiOjE3MzYyNzQ1NzIsInUiOjQ3Mzc0NSwiZyI6MjMxNTMsImNhcCI6InBhOnRzOnBzOmJmOm1hOnR5OmVvOnpvOnNiIn0.Q6B0LNieVvSoxU8AZhogRW9xEB4WfYeZjfBnbavbh0o`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const parcelCreateData = await parcelCreate.json();

        map.current!.addSource(parcelCreateData.id, {
          type: "vector",
          tiles: parcelCreateData.tiles,
          promoteId: "fid",
        });
        map.current!.addLayer({
          id: "parcels",
          type: "line",
          source: parcelCreateData.id,
          "source-layer": parcelCreateData.id,
          minzoom: 14,
          maxzoom: 20,
          layout: {
            visibility: "visible",
          },
          paint: {
            "line-color": "#649d8d",
          },
        });

        map.current!.addLayer({
          id: "parcel-assist",
          type: "fill",
          source: parcelCreateData.id,
          "source-layer": parcelCreateData.id,
          minzoom: 14,
          maxzoom: 20,
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
            "fillOpacity": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              0.9, // Almost fully opaque when selected
              ["boolean", ["feature-state", "hover"], false],
              0.5, // Half transparent when hovered
              0.1, // Default color
            ],
          },
        });

        map.current!.on("mousemove", "parcel-assist", handleMouseMove);
        // map.current!.on("mouseleave", "parcel-assist", () => handleMouseLeave(parcelCreateData.id));
      });

      map.current.on("click", (e) => {
        const feature = map.current!.queryRenderedFeatures(e.point, { layers: ["parcel-assist"] })?.[0] as any;
        if (feature) {
          // @ts-ignore
          const acreage = convertArea(area(polygon(feature.geometry?.coordinates)), "meters", "acres").toFixed(2);
          const html = `
                <ul>
                    <li>Owner: ${feature?.properties?.owner}</li>
                    <li>Acreage: ${acreage}</li>
                    <li>Parcel number: ${feature?.properties?.parcelnumb}</li>
                    <li>State: ${feature?.properties?.path.split("/")[1]}</li>
                </ul>
            `;
          new mapboxgl.Popup().setLngLat(e.lngLat).setHTML(html).addTo(map.current!);
        }
        // console.log(e, 11);
        // console.log(features?.[0]);
        // const polygon2 = polygon(features?.[0]?.geometry.coordinates);

        // const area2 = area(polygon2);
        // console.log(area2, 22);
      });
    }
  };

  // Initialize map when component mounts
  useEffect(() => {
    initializeMap();

    // Clean up on unmount
    return () => map.current?.remove();
  }, []);

  return <div className="map-container w-full h-full" ref={mapContainerRef} />;
};

export default MapboxComponent;
