/* eslint-disable no-underscore-dangle */

"use client";

import dynamic from "next/dynamic";
import { Dispatch, SetStateAction, Suspense, useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Map as MapBoX, Popup } from "mapbox-gl";
import useNotification from "@/hooks/useNotification";
import { calculateLandPriceAction2 } from "@/server-actions/volt/actions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import routes from "@/helpers/routes";
import { IUserBaseInfo } from "@/types/auth";
import { ITokens, UserSource } from "@/types/common";
import SignUp from "@/components/auth/sign-up/sign-up";
import {
  authWithCredentialsAction,
  authWithSocialNetworkAction,
  setAuthTokensAction,
  signUpUserAction,
} from "@/server-actions/new-auth/new-auth";
import { revalidateAllPathAction } from "@/server-actions/common-actions";
import { MdClear } from "react-icons/md";
import { Button } from "../ui/button";
import ResponsiveModal from "../ui/dialogs/responsive-dialog";
import SignInForm from "../auth/sign-in";
import FacebookAuthProvider from "../auth/facebook-auth-provider";
import GoogleAuthProvider from "../auth/google-auth-provider/google-auth-provider";
import ForgotPasswordButton from "../@new/user/profile/modals/forgot-password/forgot-password-button";

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

enum SignUpSteps {
  SELECT_REASONS,
  USER_INFO,
  FINISH,
}

const mapData = {
  sources: {
    markersSource: "markersSource",
    mainLandPolygonSource: "mainLandPolygonSource",
  },
  layers: {
    markersLayer: "markersLayer",
    markerClusterCountLayer: "markers-cluster-count-layer",
    markerClusterLayer: "markers-cluster-layer",
    parcelsPolygon: "parcelsPolygon",
    parcelsPolygonAssist: "parcelsPolygonAssist",
  },
};

const VoltSearchOnMap = ({
  mapRef,
  setMapRef,
  user,
  selectedLayer,
}: {
  mapRef: MapBoX | null;
  setMapRef: Dispatch<SetStateAction<MapBoX | null>>;
  user: IUserBaseInfo | null;
  selectedLayer: string;
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
  const [step, setStep] = useState(SignUpSteps.SELECT_REASONS);
  const [signUpErrorMessage, setSignUpErrorMessage] = useState<string | null>(null);
  const [signUpEmail, setSignUpEmail] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [isPolygonPending, setPolygonPending] = useState(false);
  const [userSource, setUserSource] = useState(UserSource.System);
  const [requestPending, setRequestPending] = useState(false);

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
    if (mapRef.getSource(data.id)) {
      mapRef.removeSource(data.id);
    }

    mapRef
      .addSource(data.id, {
        type: "vector",
        tiles: data.vector,
        promoteId: "parcelnumb",
      })
      .on("idle", () => {
        if (mapRef.getZoom() >= 11) {
          setPolygonPending(false);
        }
      })
      .on("moveend", () => {
        if (mapRef.getZoom() >= 11) {
          setPolygonPending(true);
        }
      });

    const layers = mapRef.getStyle()?.layers;
    let firstSymbolId;
    if (layers) {
      // eslint-disable-next-line no-restricted-syntax
      for (const layer of layers) {
        if (layer.type === "symbol") {
          firstSymbolId = layer.id;
          break;
        }
      }
    }
    // Add parcel outlines to the map with basic styles
    mapRef.addLayer(
      {
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
      },
      firstSymbolId
    );
    //   [
    //     firstSymbolId,
    //     "settlement-minor-label",
    //     "settlement-major-label",
    //     "state-label",
    //     "country-label",
    //     "continent-label",
    //     "parcels",
    //     "parcel-assist"
    // ]
    // We need a transparent but 'filled' helper layer to catch click events
    mapRef.addLayer(
      {
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
      },
      firstSymbolId
    );

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
            acreage: new Intl.NumberFormat("en-US", { maximumFractionDigits: 3, minimumFractionDigits: 2 }).format(
              Number(Math.max(Number(feature.properties.gisacre) || 0, Number(feature.properties.ll_gisacre) || 0))
            ),
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

  useEffect(() => {
    if (mapRef && selectedLayer) {
      mapRef.setStyle(selectedLayer);
    }
  }, [mapRef, selectedLayer]);

  useEffect(() => {
    if (mapRef) {
      mapRef.on("style.load", () => {
        setPolygonPending(true);
        showRegridTiles();
      });
    }
  }, [mapRef, showRegridTiles]);

  return (
    <>
      <ResponsiveModal
        dialogContentClassName="max-w-2xl w-full max-h-70vh [&>div>div:last-child]:py-2"
        drawerContentClassName="max-h-[90vh] flex px-0 [&>div:last-child]:px-5 [&>div:last-child]:overflow-auto"
        open={!!authModal}
        closeModal={() => {
          setAuthModal(null);
          setSignUpEmail(null);
          setSignUpErrorMessage(null);
          setStep(SignUpSteps.SELECT_REASONS);
        }}
      >
        <div className="py-5">
          {authModal === "sign-in" ? (
            <SignInForm
              defaultSignIn={async (data) => {
                setUserSource(UserSource.System);
                setRequestPending(true);
                const request = await authWithCredentialsAction(data);
                if (request.errorMessage) {
                  notify({ title: "Error", description: request.errorMessage }, { variant: "error" });
                  setRequestPending(false);
                } else {
                  setAuthTokensAction([
                    {
                      token: request.data!.access_token,
                      tokenName: "jwt",
                      remember: false,
                    },
                    {
                      token: request.data!.refresh_token,
                      tokenName: "jwt-refresh",
                      remember: data.remember,
                    },
                  ]);
                  await revalidateAllPathAction();
                  setTimeout(() => {
                    router.push(`${routes.volt.fullUrl}/${lastFetchedId.current}`);
                  }, 500);
                  setRequestPending(false);
                }
              }}
              authWithCredentialsPending={userSource === UserSource.System && (isTransitioning || requestPending)}
              onSignUp={() => {
                setAuthModal("sign-up");
              }}
              forgotPasswordButton={() => <ForgotPasswordButton openModal={openModal} setOpenModal={setOpenModal} user={null} />}
              authProviders={() => (
                <div className="flex flex-col gap-3 w-full">
                  <GoogleAuthProvider
                    pending={userSource === UserSource.Google && (isTransitioning || requestPending)}
                    onSuccess={async (token) => {
                      setUserSource(UserSource.Google);
                      setRequestPending(true);
                      const request = await authWithSocialNetworkAction({ token, userSource: UserSource.Google });
                      if (request.errorMessage === "Invalid credentials") {
                        const newParams = new URLSearchParams(params.toString());
                        newParams.set("userSource", UserSource.Google);
                        newParams.set("accessToken", token);
                        newParams.set("onSuccessRedirectUrl", `${routes.volt.fullUrl}/${lastFetchedId.current}`);
                        router.push(`${pathname}?${newParams.toString()}`);
                        setAuthModal("sign-up");
                      } else if (request.errorMessage) {
                        notify({ title: "Error", description: request.errorMessage }, { variant: "error" });
                        setRequestPending(false);
                      } else {
                        setAuthTokensAction([
                          {
                            token: request.data!.access_token,
                            tokenName: "jwt",
                            remember: false,
                          },
                          {
                            token: request.data!.refresh_token,
                            tokenName: "jwt-refresh",
                            remember: false,
                          },
                        ]);
                        revalidateAllPathAction();
                        setTimeout(() => {
                          router.push(`${routes.volt.fullUrl}/${lastFetchedId.current}`);
                        }, 500);
                        setRequestPending(false);
                      }
                    }}
                  />
                  <FacebookAuthProvider
                    pending={userSource === UserSource.Facebook && (isTransitioning || requestPending)}
                    onSuccess={async (token) => {
                      setUserSource(UserSource.Facebook);
                      setRequestPending(true);
                      const request = await authWithSocialNetworkAction({ token, userSource: UserSource.Facebook });
                      if (request.errorMessage === "Invalid credentials") {
                        const newParams = new URLSearchParams(params.toString());
                        newParams.set("userSource", UserSource.Google);
                        newParams.set("accessToken", token);
                        newParams.set("onSuccessRedirectUrl", `${routes.volt.fullUrl}/${lastFetchedId.current}`);
                        router.push(`${pathname}?${params.toString()}`);
                      } else if (request.errorMessage) {
                        notify({ title: "Error", description: request.errorMessage }, { variant: "error" });
                        setRequestPending(false);
                      } else {
                        setAuthTokensAction([
                          {
                            token: request.data!.access_token,
                            tokenName: "jwt",
                            remember: false,
                          },
                          {
                            token: request.data!.refresh_token,
                            tokenName: "jwt-refresh",
                            remember: false,
                          },
                        ]);
                        revalidateAllPathAction();
                        setTimeout(() => {
                          router.push(`${routes.volt.fullUrl}/${lastFetchedId.current}`);
                        }, 500);
                      }
                    }}
                  />
                </div>
              )}
              className="sm:py-10 md:py-12 lg:py-14 xl:py-16 max-w-72 mx-auto"
            />
          ) : (
            <SignUp
              step={step}
              setStep={setStep}
              errorMessage={signUpErrorMessage}
              setErrorMessage={setSignUpErrorMessage}
              email={signUpEmail}
              setEmail={setSignUpEmail}
              showSignIn={() => {
                setAuthModal("sign-up");
              }}
              authProviders={() => (
                <div className="flex flex-col gap-3 w-full">
                  <GoogleAuthProvider
                    pending={userSource === UserSource.Google && (isTransitioning || requestPending)}
                    onSuccess={async (token) => {
                      setUserSource(UserSource.Google);
                      setRequestPending(true);
                      const request = await authWithSocialNetworkAction({ token, userSource: UserSource.Google });
                      if (request.errorMessage === "Invalid credentials") {
                        const newParams = new URLSearchParams(params.toString());
                        newParams.set("userSource", UserSource.Google);
                        newParams.set("accessToken", token);
                        newParams.set("onSuccessRedirectUrl", `${routes.volt.fullUrl}/${lastFetchedId.current}`);
                        router.push(`${pathname}?${newParams.toString()}`);
                        setAuthModal("sign-up");
                      } else if (request.errorMessage) {
                        notify({ title: "Error", description: request.errorMessage }, { variant: "error" });
                        setRequestPending(false);
                      } else {
                        setAuthTokensAction([
                          {
                            token: request.data!.access_token,
                            tokenName: "jwt",
                            remember: false,
                          },
                          {
                            token: request.data!.refresh_token,
                            tokenName: "jwt-refresh",
                            remember: false,
                          },
                        ]);
                        revalidateAllPathAction();
                        setTimeout(() => {
                          router.push(`${routes.volt.fullUrl}/${lastFetchedId.current}`);
                        }, 500);
                      }
                    }}
                  />
                  <FacebookAuthProvider
                    pending={userSource === UserSource.Facebook && (isTransitioning || requestPending)}
                    onSuccess={async (token) => {
                      setUserSource(UserSource.Facebook);
                      setRequestPending(true);
                      const request = await authWithSocialNetworkAction({ token, userSource: UserSource.Facebook });
                      if (request.errorMessage === "Invalid credentials") {
                        const newParams = new URLSearchParams(params.toString());
                        newParams.set("userSource", UserSource.Google);
                        newParams.set("accessToken", token);
                        newParams.set("onSuccessRedirectUrl", `${routes.volt.fullUrl}/${lastFetchedId.current}`);
                        router.push(`${pathname}?${params.toString()}`);
                      } else if (request.errorMessage) {
                        notify({ title: "Error", description: request.errorMessage }, { variant: "error" });
                        setRequestPending(false);
                      } else {
                        setAuthTokensAction([
                          {
                            token: request.data!.access_token,
                            tokenName: "jwt",
                            remember: false,
                          },
                          {
                            token: request.data!.refresh_token,
                            tokenName: "jwt-refresh",
                            remember: false,
                          },
                        ]);
                        revalidateAllPathAction();
                        setTimeout(() => {
                          router.push(`${routes.volt.fullUrl}/${lastFetchedId.current}`);
                        }, 500);
                      }
                    }}
                  />
                </div>
              )}
              onSubmit={async (data) => {
                const request = await signUpUserAction({ ...data, redirectUrl: `${routes.volt.fullUrl}/${lastFetchedId.current}` });
                if (request.errorMessage) {
                  setSignUpErrorMessage(request.errorMessage);
                  setStep(SignUpSteps.FINISH);
                } else if (data.userSource === UserSource.Google || data.userSource === UserSource.Facebook) {
                  const params = new URLSearchParams();
                  params.set("jwt", request.data!.access_token);
                  params.set("jwtRefresh", request.data!.refresh_token);
                  params.set("redirectUrl", `${routes.volt.fullUrl}/${lastFetchedId.current}`);
                  router.push(`${routes.auth.signUp.success.fullUrl}?${params.toString()}`);
                } else {
                  setStep(SignUpSteps.FINISH);
                }
              }}
              isTransitioning={false}
              className="m-auto sm:p-10 md:p-12 lg:p-14 xl:p-16"
            />
          )}
        </div>
      </ResponsiveModal>
      <div style={{ display: "none" }}>
        <div ref={tooltipRef}>
          {openProperty && (
            <ul className="max-w-sm relative">
              <>
                <MdClear
                  className="absolute right-0.5 top-0.5 size-5 cursor-pointer text-grey-600"
                  onClick={() => {
                    setOpenProperty(null);
                  }}
                />
                <li className="text-xs text-grey-800 py-0.5 mr-12">
                  Parcel Number <span className="text-black font-semibold">{openProperty.parcelnumb_no_formatting}</span>
                </li>
                <li className="text-xs text-grey-800 py-0.5">
                  Owner <span className="text-black font-semibold">{openProperty.owner}</span>
                </li>
                <li className="text-xs text-grey-800 py-0.5">
                  Acreage <span className="text-black font-semibold">{openProperty.acreage}</span>
                </li>
                <Button className="w-full mt-6" loading={calculationPending || isTransitioning} onClick={calculatePrice}>
                  Get Data
                </Button>
              </>
            </ul>
          )}
        </div>
      </div>
      {isPolygonPending && (
        <div className="bg-white rounded-xl py-2 px-3 absolute top-2 left-2 z-10">
          <p
            style={{
              backgroundImage: "linear-gradient(90deg, #05471C 0%, #16DB65 100%)",
              color: "transparent",
              backgroundClip: "text",
            }}
            className="text-xs font-bold"
          >
            Land polygons are loading
          </p>
        </div>
      )}
      <Suspense fallback={<div className="w-full h-[full] bg-primary-main-800 animate-pulse" />}>
        <Map setRef={setMapRef} ref={mapRef} />
      </Suspense>
    </>
  );
};

export default VoltSearchOnMap;
