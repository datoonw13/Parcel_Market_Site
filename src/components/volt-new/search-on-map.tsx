/* eslint-disable no-underscore-dangle */

"use client";

import dynamic from "next/dynamic";
import { Dispatch, SetStateAction, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Map as MapBoX, Popup } from "mapbox-gl";

const Map = dynamic(() => import("@/components/maps/mapbox/mapbox-base"), { ssr: false });

const VoltSearchOnMap = ({ mapRef, setMapRef }: { mapRef: MapBoX | null; setMapRef: Dispatch<SetStateAction<MapBoX | null>> }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hoveredFeatureId = useRef<string | null | number>(null);
  const clickedFeatureProperty = useRef<string | null | number>(null);

  const showRegridTiles = useCallback(async () => {
    if (!mapRef) {
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
    if (mapRef.getLayer("parcels")) {
      mapRef.removeLayer("parcels");
    }
    if (mapRef.getLayer("parcel-assist")) {
      mapRef.removeLayer("parcel-assist");
    }
    if (mapRef.getLayer("polygon-labels")) {
      mapRef.removeLayer("polygon-labels");
    }
    if (mapRef.getSource(parcelCreateData.id)) {
      mapRef.removeSource(parcelCreateData.id);
    }
    mapRef.addSource(parcelCreateData.id, {
      type: "vector",
      tiles: parcelCreateData.vector,
      promoteId: "fid",
    });

    mapRef.addLayer({
      id: "parcels",
      type: "line",
      source: parcelCreateData.id,
      "source-layer": parcelCreateData.id,
      minzoom: 10,
      maxzoom: 21,
      layout: {
        visibility: "visible",
      },
      paint: {
        "line-color": "#649d8d",
        "line-width": 1.7,
      },
    });

    // We need a transparent but 'filled' helper layer to catch click events
    mapRef.addLayer({
      id: "parcel-assist",
      type: "fill",
      source: parcelCreateData.id,
      "source-layer": parcelCreateData.id,
      minzoom: 10,
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
    });

    // show parcel num

    mapRef.addLayer({
      id: "polygon-labels",
      type: "symbol",
      source: parcelCreateData.id,
      "source-layer": parcelCreateData.id,
      minzoom: 10,
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
    });
  }, [mapRef]);

  // const setInitialData = useCallback(async () => {
  //   if (mapRef) {
  //     showRegridTiles();
  //   }
  // }, [mapRef]);

  const openPopup = useCallback(
    ({ lat, lng }: { lng: number; lat: number }) => {
      if (mapRef) {
        const popup = mapRef._popups[0];
        if (popup) {
          popup.setLngLat([lng, lat]);
        } else {
          new Popup({
            closeButton: false,
            className: "[&>div:last-child]:rounded-xl [&>div:last-child]:shadow-5 [&>div:last-child]:p-3 tooltip",
            closeOnClick: false,
            closeOnMove: false,
            offset: [0, -20],
          })

            .setLngLat([lng, lat])
            .setDOMContent(tooltipRef.current!)
            .setMaxWidth("max-content")
            .addTo(mapRef);
        }
      }
    },

    [mapRef]
  );

  useEffect(() => {
    if (mapRef) {
      showRegridTiles();
      window.map = mapRef;
    }
  }, [showRegridTiles, mapRef]);

  // useEffect(() => {
  //   if (mapRef) {
  //     mapRef.on("style.load", () => {
  //       setInitialData();
  //     });
  //   }
  // }, [mapRef, setInitialData]);

  return (
    <>
      <div style={{ display: "none" }}>
        {/* <div mapRef={tooltipmapRef}>
          {openPropertyDetails && (
            <ul className="">
              <>
                <li className="text-xs text-grey-800 py-0.5">
                  Parcel Number <span className="text-black font-semibold">{openPropertyDetails.parcelNumberNoFormatting}</span>
                </li>
                <li className="text-xs text-grey-800 py-0.5">
                  Owner <span className="text-black font-semibold">{openPropertyDetails.owner}</span>
                </li>
                <li className="text-xs text-grey-800 py-0.5">
                  Acreage <span className="text-black font-semibold">{openPropertyDetails.acreage}</span>
                </li>
                {data && data?.length > 1 && (
                  <Button
                    className="py-1 h-auto !px-6 ml-auto flex mt-4"
                    onClick={() => {
                      if (openPropertyDetails.id === propertiesInteraction.popup?.openId) {
                        onMarkerInteraction({ popup: null });
                      } else {
                        onMarkerInteraction({
                          popup: {
                            clickId: openPropertyDetails.id.toString(),
                            openId: openPropertyDetails.id.toString(),
                            isBulked: false,
                          },
                        });
                      }
                    }}
                  >
                    {openPropertyDetails.id === propertiesInteraction.popup?.openId ? "Remove" : "Select"}
                  </Button>
                )}
              </>
            </ul>
          )}
        </div> */}
      </div>
      <Suspense fallback={<div className="w-full h-[full] bg-primary-main-800 animate-pulse" />}>
        <Map setRef={setMapRef} ref={mapRef} />
      </Suspense>
    </>
  );
};

export default VoltSearchOnMap;
