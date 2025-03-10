/* eslint-disable no-underscore-dangle */

"use client";

import dynamic from "next/dynamic";
import { Dispatch, SetStateAction, Suspense, useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Map as MapBoX, Popup } from "mapbox-gl";
import useNotification from "@/hooks/useNotification";
import { calculateLandPriceAction2 } from "@/server-actions/volt/actions";
import { swapPolygonCoordinates } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SignInForm from "@/app/auth/sign-in/sign-in";
import SignUpForm from "@/app/auth/sign-up/sign-up";
import routes from "@/helpers/routes";
import { IUserBaseInfo } from "@/types/auth";
import { Button } from "../ui/button";
import ResponsiveModal from "../ui/dialogs/responsive-dialog";

const Map = dynamic(() => import("@/components/maps/mapbox/mapbox-base"), { ssr: false });

type IProperty = {
  city: string;
  county: string;
  lat: string;
  ll_gisacre?: number;
  gisacre?: number;
  lon: string;
  ogc_fid: number;
  owner: string;
  parcelnumb: string;
  parcelnumb_no_formatting: string;
  path: string;
  state2: string;
  usedesc?: string;
  zoning_description?: string;
  acreage: number;
};

const VoltSearchOnMap = ({
  mapRef,
  setMapRef,
  user,
}: {
  mapRef: MapBoX | null;
  setMapRef: Dispatch<SetStateAction<MapBoX | null>>;
  user: IUserBaseInfo | null;
}) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const clickedFeatureProperty = useRef<string | number | null>(null);
  const hoveredFeatureProperty = useRef<string | number | null>(null);
  const hoveredFeatureId = useRef<string | number | null>(null);
  const [openProperty, setOpenProperty] = useState<(IProperty & { coordinates: string }) | null>(null);
  const [calculationPending, setCalculationPending] = useState(false);
  const router = useRouter();
  const { notify } = useNotification();
  const [isTransitioning, startTransition] = useTransition();
  const lastFetchedId = useRef<number | null>(null);
  const [authModal, setAuthModal] = useState<"sign-in" | "sign-up" | null>(null);
  const params = useSearchParams();
  const pathname = usePathname();

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
            .on("close", () => {
              setOpenProperty(null);
            })
            .addTo(mapRef);
        }
      }
    },

    [mapRef]
  );

  const showRegridTiles = useCallback(async () => {
    if (!mapRef) {
      return;
    }
    const req = await fetch(`https://tiles.regrid.com/api/v1/sources?token=${process.env.NEXT_PUBLIC_REGRID_KEY}`, {
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
    const data = await req.json();

    mapRef.addSource(data.id, {
      type: "vector",
      tiles: data.vector,
      promoteId: "parcelnumb",
    });

    // Add parcel outlines to the map with basic styles
    mapRef.addLayer({
      id: "parcels",
      type: "line",
      source: data.id,
      "source-layer": data.id,
      minzoom: 10,
      maxzoom: 21,
      layout: {
        visibility: "visible",
      },
      paint: {
        "line-color": "#649d8d",
      },
    });

    // We need a transparent but 'filled' helper layer to catch click events
    mapRef.addLayer({
      id: "parcel-assist",
      type: "fill",
      source: data.id,
      "source-layer": data.id,
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

    mapRef.on("mousemove", "parcel-assist", (e) => {
      const features = mapRef.queryRenderedFeatures(e.point, { layers: ["parcel-assist"] });
      if (features.length > 0) {
        // There may be multiple features if polygons overlap! Only show one here
        const feature = features[0];
        const coordinates = e.lngLat;
        const { id } = feature as any;
        const { ogc_fid } = feature.properties as any;

        // Update the clicked feature property for style
        hoveredFeatureProperty.current = ogc_fid === hoveredFeatureProperty.current ? null : ogc_fid;
        // Update the map style
        if (hoveredFeatureId.current !== null && hoveredFeatureId.current !== clickedFeatureProperty.current) {
          mapRef.setFeatureState({ source: data.id, sourceLayer: data.id, id: hoveredFeatureId.current }, { hover: false });
        }

        hoveredFeatureId.current = id;
        if (hoveredFeatureId !== clickedFeatureProperty) {
          mapRef.setFeatureState({ source: data.id, sourceLayer: data.id, id: hoveredFeatureId.current! }, { hover: true });
          // Trigger a repaint
          mapRef.triggerRepaint();
        }
      }
    });

    mapRef.on("mouseleave", "parcel-assist", (e) => {
      if (hoveredFeatureId.current !== null) {
        mapRef.setFeatureState({ source: data.id, sourceLayer: data.id, id: hoveredFeatureId.current }, { hover: false });
      }
      hoveredFeatureId.current = null;
    });

    mapRef.on("click", "parcel-assist", (e) => {
      const features = mapRef.queryRenderedFeatures(e.point, { layers: ["parcel-assist"] });
      if (features.length > 0) {
        const feature = features[0] as any;
        const { id } = feature as { id: string };

        if (id) {
          if (clickedFeatureProperty.current !== null && clickedFeatureProperty.current !== features[0].id) {
            mapRef.setFeatureState(
              { source: data.id, sourceLayer: data.id, id: clickedFeatureProperty.current },
              { selected: false, hover: false }
            );
          }

          clickedFeatureProperty.current = id;
          mapRef.setFeatureState(
            { source: data.id, sourceLayer: data.id, id: clickedFeatureProperty.current },
            { selected: true, hover: false }
          );
          setOpenProperty({
            ...(feature.properties as any),
            coordinates: JSON.stringify(feature.geometry?.coordinates),
            acreage: Number(Number(feature.properties.gisacre || feature.properties.ll_gisacre).toFixed(2)),
          });
          openPopup(e.lngLat);
        }
      }
    });
  }, [mapRef, openPopup]);

  const calculatePrice = async () => {
    if (!openProperty) {
      return;
    }
    setCalculationPending(true);

    const res = await calculateLandPriceAction2({
      county: openProperty.county.toLocaleLowerCase(),
      state: openProperty.state2.toLocaleLowerCase(),
      parcelNumber: openProperty.parcelnumb_no_formatting,
      owner: openProperty.owner,
      propertyType: openProperty?.zoning_description || openProperty.usedesc || "",
      coordinates: openProperty.coordinates,
      locality: "",
      acrage: openProperty.acreage.toString(),
      lat: openProperty.lat.toString(),
      lon: openProperty.lon.toString(),
    });

    if (res.data) {
      if (user) {
        startTransition(() => {
          router.push(`/volt/${res.data}`);
        });
      } else {
        lastFetchedId.current = res.data;
        setAuthModal("sign-in");
      }
    }

    if (res?.errorMessage || !res?.data) {
      notify({ title: "Error", description: res?.errorMessage || "Unknown" }, { variant: "error" });
    }
    setCalculationPending(false);
  };

  useEffect(() => {
    if (mapRef) {
      showRegridTiles();
      window.map = { ...mapRef };
    }
  }, [showRegridTiles, mapRef]);

  return (
    <>
      <ResponsiveModal
        dialogContentClassName="max-w-2xl w-full max-h-70vh [&>div>div:last-child]:pt-2"
        drawerContentClassName="max-h-[90vh] flex px-0 [&>div:last-child]:px-5 [&>div:last-child]:overflow-auto"
        open={!!authModal}
        closeModal={() => setAuthModal(null)}
      >
        <div className="py-5">
          {authModal === "sign-in" ? (
            <SignInForm
              modal={{
                showSignUp: () => setAuthModal("sign-up"),
                onAuth: () => router.push(`${routes.volt.fullUrl}/${lastFetchedId.current}`),
                closeModal: () => setAuthModal(null),
              }}
            />
          ) : (
            <SignUpForm
              modal={{
                onAuth: () => router.push(`${routes.volt.fullUrl}/${lastFetchedId.current}`),
                onRegister: () => {
                  sessionStorage.setItem("voltLastFetchedId", lastFetchedId.current?.toString() || "");
                },
                showSignIn: () => {
                  setAuthModal("sign-in");
                },
                closeModal: () => setAuthModal(null),
              }}
            />
          )}
        </div>
      </ResponsiveModal>
      <div style={{ display: "none" }}>
        <div ref={tooltipRef}>
          {openProperty && (
            <ul className="">
              <>
                <li className="text-xs text-grey-800 py-0.5">
                  Parcel Number <span className="text-black font-semibold">{openProperty.parcelnumb_no_formatting}</span>
                </li>
                <li className="text-xs text-grey-800 py-0.5">
                  Owner <span className="text-black font-semibold">{openProperty.owner}</span>
                </li>
                <li className="text-xs text-grey-800 py-0.5">
                  Acreage <span className="text-black font-semibold">{(openProperty.gisacre || openProperty.ll_gisacre)?.toFixed(2)}</span>
                </li>
                <Button className="w-full mt-6" loading={calculationPending || isTransitioning} onClick={calculatePrice}>
                  Get Data
                </Button>
              </>
            </ul>
          )}
        </div>
      </div>
      <Suspense fallback={<div className="w-full h-[full] bg-primary-main-800 animate-pulse" />}>
        <Map setRef={setMapRef} ref={mapRef} />
      </Suspense>
    </>
  );
};

export default VoltSearchOnMap;
