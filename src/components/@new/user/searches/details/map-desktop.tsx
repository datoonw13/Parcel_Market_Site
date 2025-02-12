"use client";

import dynamic from "next/dynamic";
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IUserRecentSearches } from "@/types/user";
import { IDecodedAccessToken } from "@/types/auth";
import { MapInteractionModel } from "@/types/common";
import useMap from "@/hooks/useMap";
import { GeoJSONFeature, Popup, Map as MapBoX } from "mapbox-gl";
import { swapPolygonCoordinates } from "@/lib/utils";
import moment from "moment";
import { moneyFormatter } from "@/helpers/common";
import { AutoComplete } from "@/components/ui/autocomplete";
import { MapGeoJson } from "@/types/mapbox";
import { FeatureCollection } from "geojson";
import { mapDefaultMarkers } from "@/lib/map";
import {
  IBulkPropertiesUsedForCalculation,
  IPropertyBaseInfo,
  IPropertyCalculationOptions,
  IPropertyPricePerAcre,
  IPropertySaleHistory,
  IPropertyUsedForCalculation,
} from "@/types/property";
import Divider from "@/components/@new/shared/Divider";

const MapComponent = dynamic(() => import("@/components/maps/mapbox/mapbox-base"), { ssr: false });

interface VoltDesktopProps {
  data: IUserRecentSearches;
  user: IDecodedAccessToken | null;
  openWarningModal: () => void;
  mapInteraction: MapInteractionModel;
  setMpaInteraction: Dispatch<SetStateAction<MapInteractionModel>>;
  additionalDataResult?: IUserRecentSearches;
}

const SearchItemDetailsDesktopMap: FC<VoltDesktopProps> = ({
  data,
  mapInteraction,
  openWarningModal,
  setMpaInteraction,
  user,
  additionalDataResult,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  const { ref, setRef, setGeoJson, addMarkerImages, showMarkers, highlightFeatures, showRegridTiles, openPopup, geoJson } = useMap();

  function clearMap() {
    if (!ref) return;
    const x = ref.getStyle();
    const layers = x?.layers;

    if (layers) {
      // eslint-disable-next-line no-plusplus
      for (let i = layers.length - 1; i >= 0; i--) {
        const layerId = layers[i].id;
        if (ref.getLayer(layerId)) {
          ref.removeLayer(layerId);
        }
      }
    }

    const soruces = ref.getStyle()?.sources;
    const sourcesKeys = soruces && Object.keys(soruces);
    sourcesKeys?.forEach((sourceId) => {
      if (ref.getSource(sourceId)) {
        ref.removeSource(sourceId);
      }
    });
  }

  const initiateMap = useCallback(
    async (styleChange?: boolean) => {
      if (ref) {
        const { lat, lon, parcelNumberNoFormatting, acreage, parcelNumber, price, pricePerAcreage } = data;
        const geoJsonInit: any = {
          type: "FeatureCollection",
          features: [],
        };

        geoJsonInit.features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [lon, lat],
          },
          properties: {
            parcelNumberNoFormatting,
            parcelNumber,
            lng: lon,
            lat,
            type: "selling",
            markerIcon: "selling",
            hoveredMarkerIcon: "selling",
            selectedMarkerIcon: "selling",
            markerSize: 1.5,
            hoveredMarkerSize: 1.5,
            selectedMarkerSize: 1.5,
            acreage,
            price,
            pricePerAcreage,
            polygonLineColor: "#05471C",
            polygonFillColor: "#05471C",
          },
        });

        data.propertiesUsedForCalculation
          .filter((el) => el.data.parcelNumberNoFormatting !== data.parcelNumberNoFormatting)
          .forEach((property) => {
            if (property.isBulked) {
              property.data.properties
                .filter((bulkedPropertyFilter) => bulkedPropertyFilter.parcelNumberNoFormatting !== data.parcelNumberNoFormatting)
                .forEach((bulkedProperty) => {
                  geoJsonInit.features.push({
                    type: "Feature",
                    geometry: {
                      type: "Point",
                      coordinates: [bulkedProperty.lon, bulkedProperty.lat],
                    },
                    properties: {
                      // @ts-ignore

                      state: bulkedProperty.state.value,
                      county: bulkedProperty.county.label,
                      parcelNumberNoFormatting: bulkedProperty.parcelNumberNoFormatting,
                      parcelNumber: bulkedProperty.parcelNumber,
                      lng: bulkedProperty.lon,
                      lat: bulkedProperty.lat,
                      type: "calculation-valid",
                      acreage: bulkedProperty.acreage,
                      price: bulkedProperty.lastSalePrice,
                      pricePerAcreage: bulkedProperty.pricePerAcreage,
                      bulkId: property.data.id,
                      markerIcon: "red",
                      hoveredMarkerIcon: "redHighlighted",
                      selectedMarkerIcon: "redHighlighted",
                      markerSize: 1,
                      hoveredMarkerSize: 1.2,
                      selectedMarkerSize: 1.2,
                      polygonLineColor: "#F78290",
                      polygonFillColor: "#F78290",
                    },
                  });
                });
            } else {
              geoJsonInit.features.push({
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [property.data.lon, property.data.lat],
                },
                properties: {
                  // @ts-ignore

                  state: property.data.state.value,
                  county: property.data.county.label,
                  parcelNumberNoFormatting: property.data.parcelNumberNoFormatting,
                  parcelNumber: property.data.parcelNumber,
                  lng: property.data.lon,
                  lat: property.data.lat,
                  type: "calculation-valid",
                  acreage: property.data.acreage,
                  price: property.data.lastSalePrice,
                  pricePerAcreage: property.data.pricePerAcreage,
                  markerIcon: "red",
                  hoveredMarkerIcon: "redHighlighted",
                  selectedMarkerIcon: "redHighlighted",
                  markerSize: 1,
                  hoveredMarkerSize: 1.2,
                  selectedMarkerSize: 1.2,
                  polygonLineColor: "#F78290",
                  polygonFillColor: "#F78290",
                },
              });
            }
          });

        additionalDataResult?.propertiesUsedForCalculation
          .filter((el) => el.data.parcelNumberNoFormatting !== data.parcelNumberNoFormatting)
          .forEach((property) => {
            if (property.isBulked) {
              property.data.properties
                .filter((bulkedPropertyFilter) => bulkedPropertyFilter.parcelNumberNoFormatting !== data.parcelNumberNoFormatting)
                .forEach((bulkedProperty) => {
                  geoJsonInit.features.push({
                    type: "Feature",
                    geometry: {
                      type: "Point",
                      coordinates: [bulkedProperty.lon, bulkedProperty.lat],
                    },
                    properties: {
                      // @ts-ignore

                      state: bulkedProperty.state.value,
                      county: bulkedProperty.county.label,
                      parcelNumberNoFormatting: bulkedProperty.parcelNumberNoFormatting,
                      parcelNumber: bulkedProperty.parcelNumber,
                      lng: bulkedProperty.lon,
                      lat: bulkedProperty.lat,
                      type: "calculation-not-valid",
                      acreage: property.data.acreage,
                      bulkId: property.data.id,
                      markerIcon: "yellow",
                      hoveredMarkerIcon: "yellowHighlighted",
                      selectedMarkerIcon: "yellowHighlighted",
                      markerSize: 1,
                      hoveredMarkerSize: 1.2,
                      selectedMarkerSize: 1.2,
                      polygonLineColor: "#f5990e",
                      polygonFillColor: "#f5990e",
                    },
                  });
                });
            } else {
              geoJsonInit.features.push({
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [property.data.lon, property.data.lat],
                },
                properties: {
                  // @ts-ignore
                  state: property.data.state.value,
                  county: property.data.county.label,
                  parcelNumberNoFormatting: property.data.parcelNumberNoFormatting,
                  parcelNumber: property.data.parcelNumber,
                  lng: property.data.lon,
                  lat: property.data.lat,
                  type: "calculation-not-valid",
                  markerIcon: "yellow",
                  acreage: property.data.acreage,
                  hoveredMarkerIcon: "yellowHighlighted",
                  selectedMarkerIcon: "yellowHighlighted",
                  markerSize: 1,
                  hoveredMarkerSize: 30,
                  selectedMarkerSize: 1.2,
                  polygonLineColor: "#f5990e",
                  polygonFillColor: "#f5990e",
                },
              });
            }
          });
        addMarkerImages(mapDefaultMarkers);
        setGeoJson(geoJsonInit);
        showMarkers({
          onMarkerMouseEnter: (parcelNumberNoFormatting) => {
            // setMpaInteraction((prev) => ({ ...prev, hoveredParcelNumber: parcelNumberNoFormatting }));
          },
          onMarkerMouseLeave: () => {
            // setMpaInteraction((prev) => ({ ...prev, hoveredParcelNumber: null }));
          },
          onClick: (parcelNumberNoFormatting) => {
            // setMpaInteraction((prev) => ({
            //   ...prev,
            //   openPopperParcelNumber: parcelNumberNoFormatting,
            // }));
          },
          cluster: geoJsonInit.features.length > 100,
        });
        await showRegridTiles({
          onMarkerMouseEnter: (parcelNumberNoFormatting) => {
            // setMpaInteraction((prev) => ({ ...prev, hoveredParcelNumber: parcelNumberNoFormatting }));
          },
          onMarkerMouseLeave: () => {
            // setMpaInteraction((prev) => ({ ...prev, hoveredParcelNumber: null }));
          },
          onClick: (parcelNumberNoFormatting) => {
            // setMpaInteraction((prev) => ({
            //   ...prev,
            //   openPopperParcelNumber: parcelNumberNoFormatting,
            // }));
          },
        });

        if (ref) {
          ref.on("click", "markers-layer", (e) => {
            const feature = ref.queryRenderedFeatures(e.point)[0];
            const properties = feature.properties as MapGeoJson["features"][0]["properties"];
            if (properties) {
              const html = Object.keys(properties)
                .filter((key) =>
                  [
                    "parcelNumberNoFormatting",
                    "parcelNumber",
                    "lng",
                    "lat",
                    "acreage",
                    "price",
                    "pricePerAcreage",
                    "state",
                    "county",
                  ].includes(key)
                )
                .reduce(
                  // @ts-ignore
                  (acc, cur) => [
                    ...acc,
                    `
                <li style="width: max-content;"">
                    ${cur}: <span style="font-weight:600;">${(properties as any)?.[cur as any]}</span>
                </li>
                </br>
               `,
                  ],
                  []
                ) as any;
              const history: any = [];

              if (properties.type === "selling") {
                data.propertiesUsedForCalculation.forEach((el) => {
                  if (el.isBulked) {
                    el.data.properties.flat().forEach((childEl) => {
                      if ((childEl as any).isMainProperty) {
                        history.push(el.data);
                      }
                    });
                  }
                  if (!el.isBulked) {
                    if ((el.data as any)?.isMainProperty) {
                      history.push(el.data);
                    }
                  }
                });
              }

              const html2 = `<div><h1>History </h1> <br/> <br/> ${JSON.stringify(history) || "No History"} </div>`;
              new Popup()
                .setLngLat([properties.lng, properties.lat])
                .setHTML(
                  `<ul style="height: 350px; overflow:auto; max-width: 400px; width: 100%;"><h1>ATTOM</h1> <br/>${html.join(
                    ""
                  )} <br/> ${html2}</ul> `
                )
                .addTo(ref);
            }
          });

          ref.on("click", "polygons-fill-layer-id", (e) => {
            const feature = ref.queryRenderedFeatures(e.point)[0];

            if (feature.properties && feature.layer?.id !== "markers-layer") {
              const html = Object.keys(feature.properties).reduce(
                // @ts-ignore
                (acc, cur) => [
                  ...acc,
                  `
                <li style="width: max-content;"">
                    ${cur}: <span style="font-weight:600;">${feature?.properties?.[cur]}</span>
                </li>
                </br>
               `,
                ],
                []
              ) as any;
              new Popup()
                .setLngLat(e.lngLat)
                .setHTML(
                  `<ul style="height: 350px; overflow:auto; max-width: 400px; width: 100%;"><h1>REGRID</h1> <br/>${html.join("")}</ul>`
                )
                .addTo(ref);
            }
          });
        }
        ref?.setCenter([data.lon, data.lat]);
        ref?.setZoom(8);
      }
    },
    [data, additionalDataResult?.propertiesUsedForCalculation, addMarkerImages, setGeoJson, showMarkers, showRegridTiles, ref]
  );

  const handleMarkerInteractions = useCallback(() => {
    if (ref) {
      const data: any = [];

      if (mapInteraction.hoveredParcelNumber) {
        mapInteraction.hoveredParcelNumber.split("multiple").forEach((el) => {
          data.push({ [el]: "hoveredMarkerIcon" });
        });
      }

      if (mapInteraction.openPopperParcelNumber) {
        mapInteraction.openPopperParcelNumber.split("multiple").forEach((el) => {
          data.push({ [el]: "selectedMarkerIcon" });
        });
        const feature = geoJson.features.find((el) =>
          mapInteraction.openPopperParcelNumber!.includes("multiple")
            ? el.properties.bulkId === mapInteraction.openPopperParcelNumber
            : el.properties.parcelNumberNoFormatting === mapInteraction.openPopperParcelNumber
        );
        if (feature) {
          openPopup({
            lat: feature.properties.lat,
            lng: feature.properties.lng,
            onClose: () => {
              setMpaInteraction((prev) => ({ ...prev, openPopperParcelNumber: null }));
            },
            popupRef: popupRef.current,
          });
        }
      }

      highlightFeatures(data);
    }
  }, [
    geoJson.features,
    highlightFeatures,
    mapInteraction.hoveredParcelNumber,
    mapInteraction.openPopperParcelNumber,
    openPopup,
    setMpaInteraction,
  ]);

  // const openPopupDetails = useMemo(() => {
  //   if (mapInteraction.openPopperParcelNumber === data.parcelNumberNoFormatting) {
  //     const sales = [
  //       ...data.propertiesUsedForCalculation.map((el) => (el.isBulked ? el.data.properties : el.data)),
  //       ...(additionalDataResult?.propertiesUsedForCalculation.map((el) => (el.isBulked ? el.data.properties : el.data)) || []),
  //     ]
  //       .flat()
  //       .filter((el) => el.parcelNumberNoFormatting === data.parcelNumberNoFormatting);

  //     return {

  //       type: "selling",
  //       owner: data.owner,
  //       parcelNumberNoFormatting: data.parcelNumberNoFormatting,
  //       acreage: data.acreage,
  //       sales,
  //     };
  //   }
  //   const property = [...data.propertiesUsedForCalculation, ...(additionalDataResult?.propertiesUsedForCalculation || [])].find(
  //     (el) => el.data.parcelNumberNoFormatting === mapInteraction.openPopperParcelNumber
  //   );

  //   return property ? { type: "other", ...property } : null;
  // }, [
  //   additionalDataResult?.propertiesUsedForCalculation,
  //   data.acreage,
  //   data.owner,
  //   data.parcelNumberNoFormatting,
  //   data.propertiesUsedForCalculation,
  //   mapInteraction.openPopperParcelNumber,
  // ]);

  const openPopupDetails = useMemo(() => {
    interface IBasePopupData {
      parcelNumberNoFormatting: string;
      acreage: number;
    }

    interface ISellingPropertyPopupData extends IBasePopupData {
      type: "selling";
      owner: string;
      sales?: Array<{ lastSaleDate: Date; lastSalePrice: number; pricePerAcreage: number }>;
    }

    interface IOtherPropertyPopupData extends IBasePopupData {
      type: "other";
      lastSaleDate: Date;
      lastSalePrice: number;
      pricePerAcreage: number;
      isBulked: boolean;
    }

    type IPropertyPopupDetails = ISellingPropertyPopupData | IOtherPropertyPopupData;

    if (data.parcelNumberNoFormatting === mapInteraction.openPopperParcelNumber) {
      return {
        type: "selling",
        acreage: data.acreage,
        owner: data.owner,
        parcelNumberNoFormatting: data.parcelNumberNoFormatting,
        sales: [
          ...data.propertiesUsedForCalculation.map((el) => (el.isBulked ? el.data.properties : el.data)),
          ...(additionalDataResult?.propertiesUsedForCalculation.map((el) => (el.isBulked ? el.data.properties : el.data)) || []),
        ]
          .flat()
          .filter((el) => el.parcelNumberNoFormatting === data.parcelNumberNoFormatting)
          .map((el) => ({ lastSaleDate: el.lastSaleDate, lastSalePrice: el.lastSalePrice, pricePerAcreage: el.pricePerAcreage })),
      } as IPropertyPopupDetails;
    }

    const property = [...data.propertiesUsedForCalculation, ...(additionalDataResult?.propertiesUsedForCalculation || [])].find(
      (el) => el.data.parcelNumberNoFormatting === mapInteraction.openPopperParcelNumber
    );

    return property
      ? ({
          type: "other",
          acreage: property.data.acreage,
          isBulked: property.isBulked,
          lastSaleDate: property.isBulked ? property.data.properties[0].lastSaleDate : property.data.lastSaleDate,
          parcelNumberNoFormatting: property.isBulked ? "Multiple" : property.data.parcelNumberNoFormatting,
          lastSalePrice: property.isBulked ? property.data.price : property.data.lastSalePrice,
          pricePerAcreage: property.data.pricePerAcreage,
        } as IPropertyPopupDetails)
      : null;
  }, [
    additionalDataResult?.propertiesUsedForCalculation,
    data.acreage,
    data.owner,
    data.parcelNumberNoFormatting,
    data.propertiesUsedForCalculation,
    mapInteraction.openPopperParcelNumber,
  ]);

  useEffect(() => {
    handleMarkerInteractions();
  }, [handleMarkerInteractions]);

  useEffect(() => {
    initiateMap();
  }, [initiateMap]);

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
      <div ref={popupRef} />
      {/* <div style={{ display: "none" }}>
        <div ref={popupRef}>
          {openParcelData && (
            <ul className="">
              {openParcelData?.type === PropertyTypeEnum.primary ? (
                ""
              ) : (
                <>
                  <li className="text-xs text-grey-800 py-0.5">
                    Parcel Number: <span className="text-black font-semibold">{openParcelData?.parcelNumberNoFormatting}</span>
                  </li>
                  <li className="text-xs text-grey-800 py-0.5">
                    Acreage: <span className="text-black font-semibold">{openParcelData.acreage}</span>
                  </li>
                  <li className="text-xs text-grey-800 py-0.5">
                    Last Sale Date:{" "}
                    <span className="text-black font-semibold">{moment(openParcelData?.lastSaleDate).format("MM/DD/YYYY")}</span>
                  </li>
                  <li className="text-xs text-grey-800 py-0.5">
                    Sold Price Per Acre:{" "}
                    <span className="text-black font-semibold">{moneyFormatter.format(openParcelData.pricePerAcreage)}</span>
                  </li>
                </>
              )}
            </ul>
          )}
        </div>
      </div>
      <div className="w-full h-full relative">
        <div className="absolute left-0 top-0 z-50">
          <AutoComplete
            selectedValue={null}
            options={styles.map((el) => ({ label: el, value: el }))}
            placeholder="State"
            onValueChange={(value) => {
              if (value) {
                console.log(value, ref);

                ref?.setStyle(value);
              }
              // setValue("state", value || "", { shouldValidate: true });
              // setValue("county", "", { shouldValidate: true });
            }}
            // disabled={disableSearch}
          />
        </div> */}
      <div className="fixed right-0 top-0 z-50">
        <AutoComplete
          selectedValue={null}
          options={styles.map((el) => ({ label: el, value: el }))}
          placeholder="State"
          onValueChange={(value) => {
            if (value) {
              ref?.setStyle(value);
              ref?.on("style.load", (e) => {
                initiateMap();
              });
            }
            // setValue("state", value || "", { shouldValidate: true });
            // setValue("county", "", { shouldValidate: true });
          }}
          // disabled={disableSearch}
        />
      </div>
      <div style={{ display: "none" }}>
        <div ref={popupRef}>
          {openPopupDetails && (
            <ul className="">
              {openPopupDetails.type === "selling" && (
                <>
                  <li className="text-xs text-grey-800 py-0.5">
                    Parcel Number <span className="text-black font-semibold">{openPopupDetails.parcelNumberNoFormatting}</span>
                  </li>
                  <li className="text-xs text-grey-800 py-0.5">
                    Owner <span className="text-black font-semibold">{openPopupDetails.owner}</span>
                  </li>
                  <li className="text-xs text-grey-800 py-0.5">
                    Acreage <span className="text-black font-semibold">{openPopupDetails.acreage}</span>
                  </li>
                  {openPopupDetails.sales && openPopupDetails.sales.length > 0 && (
                    <>
                      <Divider className="my-2" />
                      {openPopupDetails.sales.map((el) => (
                        <ul key={el.lastSaleDate.toString()} className="py-2 border-b">
                          <li className="text-xs text-grey-800 py-0.5">
                            Sales Date <span className="text-black font-semibold">{moment(el.lastSaleDate).format("MM/DD/YYYY")}</span>
                          </li>
                          <li className="text-xs text-grey-800 py-0.5">
                            Sales Price <span className="text-black font-semibold">{moneyFormatter.format(el.lastSalePrice)}</span>
                          </li>
                        </ul>
                      ))}
                    </>
                  )}
                </>
              )}
              {openPopupDetails.type === "other" && (
                <>
                  <li className="text-xs text-grey-800 py-0.5">
                    Parcel Number <span className="text-black font-semibold">{openPopupDetails.parcelNumberNoFormatting}</span>
                  </li>
                  <li className="text-xs text-grey-800 py-0.5">
                    Sales Date{" "}
                    <span className="text-black font-semibold">{moment(openPopupDetails.lastSaleDate).format("MM/DD/YYYY")}</span>
                  </li>
                  <li className="text-xs text-grey-800 py-0.5">
                    Sales Price <span className="text-black font-semibold">{moneyFormatter.format(openPopupDetails.lastSalePrice)}</span>
                  </li>
                </>
              )}
            </ul>
          )}
          {/* {openPopupDetails && openPopupDetails?.type === "other" && openPopupDetails. && (
            <ul className="">
              <li className="text-xs text-grey-800 py-0.5">
                Parcel Number: <span className="text-black">{openPopupDetails.parcelNumberNoFormatting}</span>
                Acreage: <span className="text-black">{openPopupDetails.acreage?.toFixed(2)}</span>
                Price Per Acreage: <span className="text-black">{openPopupDetails.pri?.toFixed(2)}</span>
              </li>
            </ul>
          )} */}
        </div>
      </div>
      <MapComponent ref={ref} setRef={setRef} />
      {/* </div> */}
    </>
  );
};

export default SearchItemDetailsDesktopMap;
