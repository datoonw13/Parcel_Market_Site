"use client";

import dynamic from "next/dynamic";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Map as MapBoX, MapMouseEvent, Popup } from "mapbox-gl";
import { VoltWrapperValuesModel } from "@/types/volt";
import useStates from "@/hooks/useStates";
import area from "@turf/area";
import { polygon, convertArea } from "@turf/helpers";
import { getPropertiesAction } from "@/server-actions/volt/actions";
import { Button } from "../ui/button";

const Map = dynamic(() => import("@/components/maps/mapbox/mapbox-base"), { ssr: false });

const VoltSearchMap = ({ data }: { data: VoltWrapperValuesModel["searchDetails"] }) => {
  const { getCounty, allStates } = useStates();
  const [mapRef, setMapRef] = useState<MapBoX | null>(null);
  const hoveredFeaturePropertyId = useRef<null | number>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [openParcelData, setOpenParcelData] = useState<{
    owner: string;
    acreage: number;
    state: string;
    county: string;
    parcelNumber: string;
  } | null>(null);

  const toggleMapOptions = useCallback(() => {
    if (!mapRef) {
      return;
    }
    if (mapRef.scrollZoom.isEnabled()) {
      mapRef.scrollZoom.disable();
    } else {
      mapRef.scrollZoom.enable();
    }

    if (mapRef.dragPan.isEnabled()) {
      mapRef.dragPan.disable();
    } else {
      mapRef.dragPan.enable();
    }

    if (mapRef.doubleClickZoom.isEnabled()) {
      mapRef.doubleClickZoom.disable();
    } else {
      mapRef.doubleClickZoom.enable();
    }
  }, [mapRef]);

  const handleMouseMove = useCallback(
    (e: MapMouseEvent) => {
      if (!mapRef) {
        return;
      }
      const features = mapRef.queryRenderedFeatures(e.point, { layers: ["parcel-assist"] });

      if (features.length > 0) {
        const feature = features[0] as any;
        const { fid }: { fid: number } = feature.properties;

        if (hoveredFeaturePropertyId.current !== fid) {
          mapRef.setFeatureState({ source: "parcels", sourceLayer: "parcels", id: hoveredFeaturePropertyId.current! }, { hover: false });
          hoveredFeaturePropertyId.current = fid;

          mapRef.setFeatureState({ source: "parcels", sourceLayer: "parcels", id: hoveredFeaturePropertyId.current }, { hover: true });
          mapRef.triggerRepaint();
        }
      }
    },
    [mapRef]
  );

  const initializeMap = useCallback(() => {
    if (mapRef) {
      mapRef.on("load", async () => {
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

        mapRef!.addSource(parcelCreateData.id, {
          type: "vector",
          tiles: parcelCreateData.tiles,
          promoteId: "fid",
        });
        mapRef!.addLayer({
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

        mapRef!.addLayer({
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
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              0.9, // Almost fully opaque when selected
              ["boolean", ["feature-state", "hover"], false],
              0.5, // Half transparent when hovered
              0.1, // Default color
            ],
          },
        });

        mapRef.on("mousemove", "parcel-assist", handleMouseMove);
      });

      mapRef.on("click", (e) => {
        const feature = mapRef!.queryRenderedFeatures(e.point, { layers: ["parcel-assist"] })?.[0] as any;
        if (feature) {
          // @ts-ignore
          const acreage = convertArea(area(polygon(feature.geometry?.coordinates)), "meters", "acres").toFixed(2);
          setOpenParcelData({
            owner: feature?.properties?.owner || "",
            acreage: Number(acreage),
            county:
              getCounty(feature?.properties?.path.split("/")[2], feature?.properties?.path.split("/")[3])?.short.label ||
              feature?.properties?.path,
            state: allStates.find((el) => el.value === feature?.properties?.path.split("/")[2])?.label || "",
            parcelNumber: feature?.properties?.parcelnumb,
          });
          console.log(feature, 22);

          if (popupRef.current) {
            new Popup({ closeButton: false, className: "[&>div:last-child]:rounded-xl [&>div:last-child]:shadow-4 [&>div:last-child]:p-3" })
              .setLngLat(e.lngLat)
              .setDOMContent(popupRef.current)
              .addTo(mapRef);
          }
        }
      });
    }
  }, [handleMouseMove, mapRef]);

  useEffect(() => {
    if (mapRef) {
      toggleMapOptions();
      initializeMap();
    }
  }, [initializeMap, mapRef, toggleMapOptions]);

  useEffect(() => {
    if (mapRef && data) {
      const county = getCounty(data.state, data.county);
      if (county) {
        mapRef.flyTo({ center: [county.full.lng, county.full.lat], zoom: 14 });
        toggleMapOptions();
      }
    }
  }, [data, getCounty, mapRef, toggleMapOptions]);

  return (
    <div className="w-full h-full">
      <div style={{ display: "none" }}>
        <div ref={popupRef}>
          <ul className="">
            <li className="text-xs text-grey-800 py-0.5">
              Owner: <span className="text-black">{openParcelData?.owner}</span>
            </li>
            <li className="text-xs text-grey-800 py-0.5">
              Parcel ID: <span className="text-black">{openParcelData?.parcelNumber}</span>
            </li>
            <li className="text-xs text-grey-800 py-0.5">
              Acreage: <span className="text-black">{openParcelData?.acreage}</span>
            </li>
            <li className="text-xs text-grey-800 py-0.5">
              State: <span className="text-black">{openParcelData?.state}</span>
            </li>
            <li className="text-xs text-grey-800 py-0.5">
              County: <span className="text-black">{openParcelData?.county}</span>
            </li>
          </ul>
          <Button className="mt-3 w-full min-w-40">Get Data</Button>
        </div>
      </div>
      <Suspense fallback={<div className="w-full h-full bg-primary-main-100 animate-pulse" />}>
        <Map setRef={setMapRef} ref={mapRef} />
      </Suspense>
    </div>
  );
};

export default VoltSearchMap;
