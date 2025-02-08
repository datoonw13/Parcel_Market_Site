/* eslint-disable no-underscore-dangle */

"use client";

import dynamic from "next/dynamic";
import { FC, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import { z } from "zod";
import { MapGeoJson } from "@/types/mapbox";
import { createMarkerImage, mapDefaultMarkers } from "@/lib/map";
import { Map as MapBoX, Popup } from "mapbox-gl";

const Map = dynamic(() => import("@/components/maps/mapbox/mapbox-base"), { ssr: false });

const mapData = {
  sources: {
    markersSource: "markersSource",
  },
  layers: {
    markersLayer: "markersLayer",
    markerClusterCountLayer: "markers-cluster-count-layer",
    markerClusterLayer: "markers-cluster-layer",
  },
};

interface VoltDetailsMapProps {
  data: z.infer<typeof PropertyDataSchema>;
  isNonValidMedianHighlighted: boolean;
  onMarkerInteraction: (parcelNumberNoFormatting: string, action: "hover" | "popup") => void;
  onMouseLeave: () => void;
  onPopupClose: () => void;
  propertiesInteraction: { [key: string]: "hovered" | "popup" };
  selectedLayer: string;
}

const VoltDetailsMap: FC<VoltDetailsMapProps> = ({
  data,
  isNonValidMedianHighlighted,
  onMarkerInteraction,
  onMouseLeave,
  propertiesInteraction,
  onPopupClose,
  selectedLayer,
}) => {
  const [ref, setRef] = useState<MapBoX | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // const openPopupDetails = useMemo(() => {
  //   const id = Object.keys(propertiesInteraction).find((key) => propertiesInteraction[key] === "popup");
  //   if (!id) {
  //     return null;
  //   }

  //   if (data.parcelNumberNoFormatting === id) {
  //     const salesHistory = data.assessments
  //       .map((el) => (el.isBulked ? el.data.properties : el.data))
  //       .flat()
  //       .find((el) => el.parcelNumberNoFormatting === data.parcelNumberNoFormatting);
  //     const details = {
  //       type: "main-property" as const,
  //       lat: data.lat,
  //       lon: data.lon,
  //       salesHistory: salesHistory
  //         ? {
  //             lastSaleDate: salesHistory.lastSalesDate,
  //             lastSalesPrice: salesHistory.lastSalesPrice,
  //           }
  //         : null,
  //       data: {
  //         owner: {
  //           label: "Owner",
  //           value: data.owner,
  //         },
  //         parcelNumber: {
  //           label: "Parcel ID",
  //           value: data.parcelNumberNoFormatting,
  //         },
  //         acreage: {
  //           label: "Acreage",
  //           value: data.acreage.toFixed(2),
  //         },
  //         stateAndCounty: {
  //           label: "State/County",
  //           value: `${data.state}/${data.county.replace("County", "")}`,
  //         },
  //         voltValue: {
  //           label: "Sale Date",
  //           value: moneyFormatter.format(data.price),
  //         },
  //         pricePerAcreage: {
  //           label: "Price Per Acreage",
  //           value: moneyFormatter.format(data.price / data.acreage),
  //         },
  //       },
  //     };
  //     return details;
  //   }

  //   const property = data.assessments.find((el) => (el.isBulked ? el.data.id === id : el.data.parcelNumberNoFormatting === id));
  //   if (!property) {
  //     return null;
  //   }

  //   if (property.isBulked) {
  //     const hasSellingProperty = !!property.data.properties.find((el) => el.parcelNumberNoFormatting === data.parcelNumberNoFormatting);

  //     const details = {
  //       type: "bulk" as const,
  //       lat: hasSellingProperty ? data.lat : property.data.properties[0].latitude,
  //       lon: hasSellingProperty ? data.lon : property.data.properties[0].longitude,
  //       hasSellingProperty,
  //       data: {
  //         parcelNumber: {
  //           label: "Parcel ID",
  //           value: "Multiple",
  //         },
  //         acreage: {
  //           label: "Acreage",
  //           value: property.data.acreage.toFixed(2),
  //         },
  //         stateAndCounty: {
  //           label: "State/County",
  //           value: `${property.data.state}/${property.data.county.replace("County", "")}`,
  //         },
  //         lastSalePrice: {
  //           label: "Last Sale Price",
  //           value: moneyFormatter.format(property.data.price),
  //         },
  //         lastSaleDate: {
  //           label: "Last Sale Date",
  //           value: moment(property.data.properties[0].lastSalesDate).format("MM-DD-YYYY"),
  //         },
  //         pricePerAcreage: {
  //           label: "Price Per Acreage",
  //           value: property.data.pricePerAcreage.toFixed(2),
  //         },
  //       },
  //     };
  //     return details;
  //   }

  //   if (!property.isBulked) {
  //     const details = {
  //       type: "default" as const,
  //       lat: property.data.latitude,
  //       lon: property.data.longitude,
  //       data: {
  //         parcelNumber: {
  //           label: "Parcel ID",
  //           value: property.data.parcelNumberNoFormatting,
  //         },
  //         acreage: {
  //           label: "Acreage",
  //           value: property.data.acreage.toFixed(2),
  //         },
  //         stateAndCounty: {
  //           label: "State/County",
  //           value: `${property.data.state}/${property.data.county.replace("County", "")}`,
  //         },
  //         lastSalePrice: {
  //           label: "Last Sale Price",
  //           value: moneyFormatter.format(property.data.lastSalesPrice),
  //         },
  //         lastSaleDate: {
  //           label: "Last Sale Date",
  //           value: moment(property.data.lastSalesDate).format("MM-DD-YYYY"),
  //         },
  //         pricePerAcreage: {
  //           label: "Price Per Acreage",
  //           value: property.data.pricePerAcreage.toFixed(2),
  //         },
  //       },
  //     };

  //     return details;
  //   }

  //   return null;
  // }, [
  //   data.acreage,
  //   data.assessments,
  //   data.county,
  //   data.lat,
  //   data.lon,
  //   data.owner,
  //   data.parcelNumberNoFormatting,
  //   data.price,
  //   data.state,
  //   propertiesInteraction,
  // ]);

  const addMarkerImages = useCallback(
    (data: Record<string, string>) =>
      Promise.all(
        Object.keys(data).map(
          (key) =>
            new Promise((resolve) => {
              const img = createMarkerImage(data[key]);
              img.onload = (e) => {
                ref?.loadImage(data[key], () => {
                  ref!.addImage(key, img);
                  resolve(img);
                });
              };
            })
        )
      ),
    [ref]
  );

  const setInitialData = useCallback(async () => {
    if (ref) {
      Object.values(mapData.layers).forEach((el) => {
        const layer = ref.getLayer(el);
        if (layer) {
          ref.removeLayer(layer.id);
        }
      });

      Object.keys(mapDefaultMarkers).forEach((img) => {
        const image = ref.hasImage(img);
        if (image) {
          ref.removeImage(img);
        }
      });

      Object.values(mapData.sources).forEach((el) => {
        const source = ref.getSource(el);
        if (source) {
          ref.removeSource(el);
        }
      });

      window.map = ref;
      await addMarkerImages(mapDefaultMarkers);

      const geoJsonInit: MapGeoJson = {
        type: "FeatureCollection",
        features: [],
      };
      geoJsonInit.features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [data.lon, data.lat],
        },
        properties: {
          parcelNumberNoFormatting: data.parcelNumberNoFormatting,
          parcelNumber: data.parcelNumber,
          lng: data.lon,
          lat: data.lat,
          type: "selling",
          markerIcon: "selling",
          hoveredMarkerIcon: "selling",
          selectedMarkerIcon: "selling",
          markerSize: 1.5,
          hoveredMarkerSize: 1.5,
          selectedMarkerSize: 1.5,
          acreage: data.acreage,
          price: data.price,
          pricePerAcreage: data.price / data.acreage,
          polygonLineColor: "#05471C",
          polygonFillColor: "#05471C",
        },
      });

      data.assessments.forEach((el) => {
        if (el.isBulked) {
          el.data.properties.forEach((childEl) => {
            if (childEl.parcelNumberNoFormatting !== data.parcelNumberNoFormatting) {
              geoJsonInit.features.push({
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [childEl.longitude, childEl.latitude],
                },
                properties: {
                  parcelNumberNoFormatting: childEl.parcelNumberNoFormatting,
                  parcelNumber: childEl.parcelNumber,
                  lng: childEl.longitude,
                  lat: childEl.latitude,
                  type: el.data.isMedianValid ? "calculation-valid" : "calculation-not-valid",
                  markerIcon: "red",
                  hoveredMarkerIcon: "redHighlighted",
                  selectedMarkerIcon: "redHighlighted",
                  markerSize: 1,
                  hoveredMarkerSize: 1.5,
                  selectedMarkerSize: 1.5,
                  acreage: childEl.acreage,
                  price: childEl.lastSalesPrice,
                  pricePerAcreage: childEl.pricePerAcreage,
                  lastSaleDate: childEl.lastSalesDate,
                  polygonLineColor: "#05471C",
                  polygonFillColor: "#05471C",
                  bulkId: el.data.id,
                  isBulkMedianValid: el.data.isMedianValid,
                },
              });
            }
          });
        } else if (el.data.parcelNumberNoFormatting !== data.parcelNumberNoFormatting) {
          geoJsonInit.features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [el.data.longitude, el.data.latitude],
            },
            properties: {
              parcelNumberNoFormatting: el.data.parcelNumberNoFormatting,
              parcelNumber: el.data.parcelNumber,
              lng: el.data.longitude,
              lat: el.data.latitude,
              type: el.data.isMedianValid ? "calculation-valid" : "calculation-not-valid",
              markerIcon: "red",
              hoveredMarkerIcon: "redHighlighted",
              selectedMarkerIcon: "redHighlighted",
              markerSize: 1,
              hoveredMarkerSize: 1.5,
              selectedMarkerSize: 1.5,
              acreage: el.data.acreage,
              price: el.data.lastSalesPrice,
              pricePerAcreage: el.data.pricePerAcreage,
              lastSaleDate: el.data.lastSalesDate,
              polygonLineColor: "#05471C",
              polygonFillColor: "#05471C",
            },
          });
        }
      });

      ref.addSource(mapData.sources.markersSource, {
        type: "geojson",
        data: geoJsonInit,
        generateId: true,
        ...(geoJsonInit.features.length > 50 && {
          cluster: true,
          clusterMaxZoom: 8,
          clusterRadius: 50,
        }),
      });

      ref
        .addLayer({
          id: mapData.layers.markersLayer,
          type: "symbol",
          source: mapData.sources.markersSource,
          layout: {
            "icon-image": "{markerIcon}",
            "icon-size": ["get", "markerSize"],
            "icon-allow-overlap": true,
          },
        })
        .on("dblclick", (e) => {
          const property = ref.queryRenderedFeatures(e.point)[0] as any;
          if (property) {
            e.preventDefault();
            ref.setZoom(14);
            ref.setCenter([property.properties.lng, property.properties.lat]);
          }
        });

      if (geoJsonInit.features.length > 50) {
        ref.addLayer({
          id: mapData.layers.markerClusterLayer,
          type: "circle",
          source: mapData.sources.markersSource,
          filter: ["has", "point_count"],
          paint: {
            "circle-color": ["step", ["get", "point_count"], "#51bbd6", 100, "#f1f075", 750, "#f28cb1"],
            "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
          },
        });

        ref.addLayer({
          id: mapData.layers.markerClusterCountLayer,
          type: "symbol",
          source: mapData.sources.markersSource,
          filter: ["has", "point_count"],
          layout: {
            "text-field": ["get", "point_count_abbreviated"],
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
        });
      }
      ref.setZoom(8);
      ref.setCenter([data.lon, data.lat]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    addMarkerImages,
    data.acreage,
    data.assessments,
    data.lat,
    data.lon,
    data.parcelNumber,
    data.parcelNumberNoFormatting,
    data.price,
    ref,
  ]);

  const updateMarkerColor = useCallback(() => {
    if (!ref) return;
    if (isNonValidMedianHighlighted) {
      const source = ref.getSource(mapData.sources.markersSource);
      if (source?.type === "geojson") {
        const data = source._data as MapGeoJson;
        const newData = {
          ...data,
        };
        newData.features = data.features.map((el) =>
          el.properties.type === "calculation-not-valid"
            ? {
                ...el,
                properties: {
                  ...el.properties,
                  markerIcon: "yellow",
                  hoveredMarkerIcon: "yellowHighlighted",
                  selectedMarkerIcon: "yellowHighlighted",
                },
              }
            : el
        );
        source.setData({ ...newData });

        // source.setData({ ...newData });
      }
    } else {
      const source = ref.getSource(mapData.sources.markersSource);
      if (source?.type === "geojson") {
        const data = source._data as MapGeoJson;
        const newData = {
          ...data,
        };
        newData.features = data.features.map((el) =>
          el.properties.type === "calculation-not-valid"
            ? {
                ...el,
                properties: {
                  ...el.properties,
                  markerIcon: "red",
                  hoveredMarkerIcon: "redHighlighted",
                  selectedMarkerIcon: "redHighlighted",
                },
              }
            : el
        );
        source.setData({ ...newData });
      }
    }
  }, [isNonValidMedianHighlighted, ref]);

  const handleMarkerInteraction = useCallback(() => {
    ref?.on("mousemove", mapData.layers.markersLayer, (e) => {
      const feature = ref.queryRenderedFeatures(e.point)[0].properties as MapGeoJson["features"][0]["properties"];
      if (feature) {
        const id = feature.bulkId ? feature.bulkId : feature.parcelNumberNoFormatting;
        onMarkerInteraction(id, "hover");
      }
    });

    ref?.on("mouseleave", mapData.layers.markersLayer, (e) => {
      onMouseLeave();
    });

    ref?.on("click", mapData.layers.markersLayer, (e) => {
      const feature = ref.queryRenderedFeatures(e.point)[0].properties as MapGeoJson["features"][0]["properties"];

      if (feature) {
        const id = feature.bulkId ? feature.bulkId : feature.parcelNumberNoFormatting;
        if (id) {
          onMarkerInteraction(id, "popup");
        }
      }
    });
  }, [onMarkerInteraction, onMouseLeave, ref]);

  // const openPopup = useCallback(
  //   ({ lat, lng, popupRef, onClose }: { lng: number; lat: number; popupRef: any; onClose: () => void }) => {
  //     if (ref) {
  //       const existedPopup = ref._popups[0];
  //       if (existedPopup && !existedPopup._classList.has("tooltip")) {
  //         existedPopup.setLngLat([lng, lat]);
  //         return;
  //       }
  //       new Popup({
  //         closeButton: false,
  //         className: "[&>div:last-child]:rounded-xl [&>div:last-child]:shadow-5 [&>div:last-child]:p-3 popup",
  //       })
  //         .setLngLat([lng, lat])
  //         .setDOMContent(popupRef.current)
  //         .setMaxWidth("max-content")
  //         .addTo(ref)
  //         .on("close", () => {
  //           onClose();
  //         });
  //     }
  //   },

  //   [ref]
  // );

  const openTooltip = useCallback(
    ({ lat, lng, popupRef }: { lng: number; lat: number; popupRef: any }) => {
      if (ref) {
        const existedTooltip = ref._popups.find((el) => el._classList.has("tooltip"));
        if (existedTooltip) {
          existedTooltip.remove();
        }
        new Popup({
          closeButton: false,
          className: "[&>div:last-child]:rounded-xl [&>div:last-child]:shadow-5 [&>div:last-child]:p-3 tooltip",
          closeOnClick: false,
          closeOnMove: false,
          offset: [0, -20],
        })
          .setLngLat([lng, lat])
          .setDOMContent(popupRef.current)
          .setMaxWidth("max-content")
          .addTo(ref);
      }
    },

    [ref]
  );

  const highlightMarkers = useCallback(() => {
    if (!ref || !ref.getLayer(mapData.layers.markersLayer)) return;
    const hoveredMarker = Object.keys(propertiesInteraction).find((key) => propertiesInteraction[key] === "hovered");
    const openPopupMarker = Object.keys(propertiesInteraction).find((key) => propertiesInteraction[key] === "popup");

    const list: Array<{ [key: string]: "default" | "hovered" | "selected" }> = [];

    if (hoveredMarker) {
      list.push({ [hoveredMarker]: "hovered" });
      const property = data.assessments.find((el) =>
        el.isBulked ? el.data.id === hoveredMarker : el.data.parcelNumberNoFormatting === hoveredMarker
      );

      if (property) {
        openTooltip({
          lat: property.isBulked ? property.data.properties[0].latitude : property.data.latitude,
          lng: property.isBulked ? property.data.properties[0].longitude : property.data.longitude,
          popupRef: tooltipRef,
        });
      }
    } else {
      ref._popups.forEach((el) => {
        if (el._classList.has("tooltip")) {
          el.remove();
        }
      });
    }

    if (openPopupMarker) {
      list.push({ [openPopupMarker]: "selected" });
      const property = data.assessments.find((el) =>
        el.isBulked ? el.data.id === openPopupMarker : el.data.parcelNumberNoFormatting === openPopupMarker
      );

      if (property) {
        ref._popups.forEach((popup) => {
          // popup.remove();
        });
        // openPopup({
        //   lat: property.isBulked ? property.data.properties[0].latitude : property.data.latitude,
        //   lng: property.isBulked ? property.data.properties[0].longitude : property.data.longitude,
        //   popupRef,
        //   onClose: () => {
        //     onPopupClose();
        //   },
        // });
      }
    }

    if (list.length) {
      const markerIconFilters = list.map((el) => {
        const [key, value] = [Object.keys(el)[0], Object.values(el)[0]];
        // eslint-disable-next-line no-nested-ternary
        const markerType = value === "default" ? "markerSize" : value === "hovered" ? "hoveredMarkerIcon" : "selectedMarkerIcon";

        return [
          ["==", ["get", key.includes("multiple") ? "bulkId" : "parcelNumberNoFormatting"], key],
          ["get", markerType],
        ];
      });

      ref.setLayoutProperty(mapData.layers.markersLayer, "icon-image", [
        "case",
        ...markerIconFilters.flat(),
        ["get", "markerIcon"], // Otherwise, use default icon
      ]);

      ///
      const symbolSortFilters = list.map((el) => {
        const [key, value] = [Object.keys(el)[0], Object.values(el)[0]];
        // eslint-disable-next-line no-nested-ternary

        return [["==", ["get", key.includes("multiple") ? "bulkId" : "parcelNumberNoFormatting"], key], 2];
      });

      ref.setLayoutProperty(mapData.layers.markersLayer, "symbol-sort-key", ["case", ...symbolSortFilters.flat(), 1]);
      ///

      const markerSizeFilters = list.map((el) => {
        const [key, value] = [Object.keys(el)[0], Object.values(el)[0]];
        // eslint-disable-next-line no-nested-ternary
        const markerSize = value === "default" ? "markerSize" : value === "hovered" ? "hoveredMarkerSize" : "selectedMarkerSize";

        return [
          ["==", ["get", key.includes("multiple") ? "bulkId" : "parcelNumberNoFormatting"], key],
          ["get", markerSize],
        ];
      });

      ref.setLayoutProperty(mapData.layers.markersLayer, "icon-size", [
        "case",
        ...markerSizeFilters.flat(),
        ["get", "markerSize"], // Otherwise, use default icon
      ]);
    } else {
      ref.setLayoutProperty(mapData.layers.markersLayer, "icon-image", ["get", "markerIcon"]);
      ref.setLayoutProperty(mapData.layers.markersLayer, "icon-size", ["get", "markerSize"]);
    }
  }, [data.assessments, openTooltip, propertiesInteraction, ref]);

  useEffect(() => {
    setInitialData();
  }, [setInitialData]);

  useEffect(() => {
    updateMarkerColor();
  }, [updateMarkerColor]);

  useEffect(() => {
    handleMarkerInteraction();
  }, [handleMarkerInteraction]);

  useEffect(() => {
    highlightMarkers();
  }, [highlightMarkers]);

  useEffect(() => {
    if (ref) {
      ref.on("style.load", () => {
        setInitialData();
      });
    }
  }, [ref, setInitialData]);

  useEffect(() => {
    if (ref && selectedLayer) {
      ref.setStyle(selectedLayer);
    }
  }, [ref, selectedLayer]);

  return (
    <>
      {/* <div style={{ display: "none" }}>
        <div className="" ref={popupRef}>
          {openPopupDetails && <VoltDetailsMapPopup data={openPopupDetails} />}
        </div>
      </div> */}
      <div style={{ display: "none" }}>
        <div className="" ref={tooltipRef}>
          <ul>
            <li className="flex items-center gap-2">
              <div className="rounded-full size-1.5 bg-primary-main-400" />
              <p className="text-grey-600 font-medium text-sm max-w-40">Click to get info</p>
            </li>
            <li className="flex items-center gap-2">
              <div className="rounded-full size-1.5 bg-primary-main-400" />
              <p className="text-grey-600 font-medium text-sm max-w-40">Double click to zoom in</p>
            </li>
          </ul>
        </div>
      </div>
      <Suspense fallback={<div className="w-full h-[full] bg-primary-main-800 animate-pulse" />}>
        <Map setRef={setRef} ref={ref} />
      </Suspense>
    </>
  );
};

export default VoltDetailsMap;
