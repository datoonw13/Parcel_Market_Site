"use client";

import dynamic from "next/dynamic";
import { Dispatch, FC, SetStateAction, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Map as MapBoX, MapMouseEvent, Popup } from "mapbox-gl";
import { IVoltPriceCalculationReqParams, VoltSteps, VoltWrapperValuesModel } from "@/types/volt";
import useStates from "@/hooks/useStates";
import area from "@turf/area";
import { polygon, convertArea } from "@turf/helpers";

import { calculateLandPriceAction, calculateLandPriceAction2 } from "@/server-actions/volt/actions";
import useNotification from "@/hooks/useNotification";
import { getAdditionalSearchDetails } from "@/server-actions/user-searches/actions";
import { swapPolygonCoordinates } from "@/lib/utils";
// @ts-ignore
import polylabel from "@mapbox/polylabel";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { TermsConditionsDialog } from "../shared/terms-conditions";
import { AutoComplete } from "../ui/autocomplete";

const Map = dynamic(() => import("@/components/maps/mapbox/mapbox-base"), { ssr: false });
interface VoltSearchMapProps {
  data: VoltWrapperValuesModel["searchDetails"];
  setStep: Dispatch<SetStateAction<VoltSteps>>;
  setValues: Dispatch<SetStateAction<VoltWrapperValuesModel>>;
  values: VoltWrapperValuesModel;
}

const VoltSearchMap: FC<VoltSearchMapProps> = ({ data, setValues, setStep, values }) => {
  const { notify } = useNotification();
  const { getCounty, allStates, getState } = useStates();
  const [mapRef, setMapRef] = useState<MapBoX | null>(null);
  const hoveredFeaturePropertyId = useRef<null | number>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [openParcelData, setOpenParcelData] = useState<{
    owner: string;
    acreage: number;
    lat: number;
    lng: number;
    state: string;
    county: string;
    parcelNumber: string;
    coordinates: string;
    proeprtyType: string;
    locality: string;
  } | null>(null);
  const [showCalculationTerms, setShowCalculationTerms] = useState(false);
  const [calculationPending, setCalculationPending] = useState(false);

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

  const initializeMap = useCallback(async () => {
    if (mapRef) {
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

      mapRef!.addSource(parcelCreateData.id, {
        type: "vector",
        tiles: parcelCreateData.vector,
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

      mapRef.on("click", (e) => {
        const feature: any = mapRef!.queryRenderedFeatures(e.point, {
          layers: ["parcel-assist"],
        })?.[0];

        if (feature) {
          console.log(feature, 22);

          setOpenParcelData({
            owner: feature?.properties?.owner || "",
            acreage: Number(Number(feature.properties.gisacre || feature.properties.ll_gisacre).toFixed(2)),
            county: feature?.properties?.county?.toLocaleLowerCase() || "",
            state: feature?.properties?.state2.toLocaleLowerCase() || "",
            parcelNumber: feature?.properties?.parcelnumb,
            lat: Number(feature.properties.lat),
            lng: Number(feature.properties.lon),
            coordinates: JSON.stringify(swapPolygonCoordinates(feature.geometry?.coordinates)),
            proeprtyType: feature?.properties.zoning_description || feature.properties.usedesc || "",
            locality: feature.properties.city || "",
          });

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

  const calculatePrice = async () => {
    if (!openParcelData) {
      return;
    }
    setCalculationPending(true);

    const res = await calculateLandPriceAction2({
      county: openParcelData.county,
      state: openParcelData.state,
      parcelNumber: openParcelData.parcelNumber,
      owner: openParcelData.owner,
      propertyType: openParcelData.proeprtyType,
      coordinates: openParcelData.coordinates,
      locality: "",
      acrage: openParcelData.acreage.toString(),
      lat: openParcelData.lat.toString(),
      lon: openParcelData.lng.toString(),
    });

    if (res.data) {
      router.push(`/volt/${res.data}`);
    }

    if (res?.errorMessage || !res?.data) {
      notify({ title: "Error", description: res?.errorMessage || "Unknown" }, { variant: "error" });
    }
    setCalculationPending(false);
  };

  useEffect(() => {
    if (mapRef) {
      // toggleMapOptions();
      initializeMap();
    }
  }, [initializeMap, mapRef, toggleMapOptions]);

  useEffect(() => {
    if (mapRef && data) {
      const county = getCounty(data.state, data.county);
      if (county) {
        mapRef.flyTo({ center: [county.full.lng, county.full.lat], zoom: 14 });
        // toggleMapOptions();
      }
    }
  }, [data, getCounty, mapRef, toggleMapOptions]);

  const styles = [
    "mapbox://styles/mapbox/standard",
    "mapbox://styles/mapbox/standard-satellite",
    "mapbox://styles/mapbox/streets-v12",
    "mapbox://styles/mapbox/outdoors-v12",
    "mapbox://styles/mapbox/light-v11",
    "mapbox://styles/mapbox/dark-v11",
    "mapbox://styles/mapbox/satellite-v9",
    "mapbox://styles/mapbox/satellite-streets-v12",
    "mapbox://styles/mapbox/navigation-day-v1",
    "mapbox://styles/mapbox/navigation-night-v1",
  ];

  return (
    <>
      <div className="fixed right-0 top-0 z-50">
        <AutoComplete
          selectedValue={null}
          options={styles.map((el) => ({ label: el, value: el }))}
          placeholder="State"
          onValueChange={(value) => {
            if (value) {
              mapRef?.setStyle(value);
              mapRef?.on("style.load", (e) => {
                initializeMap();
              });
            }
            // setValue("state", value || "", { shouldValidate: true });
            // setValue("county", "", { shouldValidate: true });
          }}
          // disabled={disableSearch}
        />
      </div>
      <TermsConditionsDialog
        open={showCalculationTerms}
        closeModal={() => setShowCalculationTerms(false)}
        showAgree
        onOk={() => {
          calculatePrice();
          setShowCalculationTerms(false);
        }}
      />
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
                State: <span className="text-black">{openParcelData?.state && getState(openParcelData?.state)?.label}</span>
              </li>
              <li className="text-xs text-grey-800 py-0.5">
                County:{" "}
                <span className="text-black">{getCounty(openParcelData?.state || "", openParcelData?.county || "")?.short.label}</span>
              </li>
            </ul>
            <Button onClick={calculatePrice} loading={calculationPending} className="mt-3 w-full min-w-40">
              Get Data
            </Button>
          </div>
        </div>
        <Suspense fallback={<div className="w-full h-full bg-primary-main-100 animate-pulse" />}>
          <Map setRef={setMapRef} ref={mapRef} />
        </Suspense>
      </div>
    </>
  );
};

export default VoltSearchMap;
