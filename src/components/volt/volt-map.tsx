// "use client";

// import { IVoltPriceCalculation, VoltSteps, VoltWrapperValuesModel } from "@/types/volt";
// import { Icon, Map as LeafletMap, Marker } from "leaflet";
// import dynamic from "next/dynamic";
// import { Dispatch, FC, ReactElement, SetStateAction, useCallback, useEffect, useMemo, useRef } from "react";
// import { moneyFormatter } from "@/helpers/common";
// import { IDecodedAccessToken } from "@/types/auth";
// import { MapInteractionModel } from "@/types/common";
// import { IPropertyBaseInfo, IPropertyUsedForCalculation } from "@/types/property";
// import moment from "moment";
// import { getCenter } from "geolib";
// import useMediaQuery from "@/hooks/useMediaQuery";
// import { Button } from "../ui/button";
// import { breakPoints } from "../../../tailwind.config";

// const Map = dynamic(() => import("@/components/shared/map/Map"), { ssr: false });

// const markerDefault = new Icon({
//   iconUrl: "/map-default-icon.svg",
//   iconSize: [28, 36],
// });

// const markerDefaultYellow = new Icon({
//   iconUrl: "/map-default-orange-icon.svg",
//   iconSize: [28, 36],
// });

// const markerHighlighted = new Icon({
//   iconUrl: "/map-highlighted-icon.svg",
//   iconSize: [28, 36],
// });

// const markerHighlightedYellow = new Icon({
//   iconUrl: "/map-highlighted-orange-icon.svg",
//   iconSize: [28, 36],
// });

// interface VoltDesktopProps {
//   step: VoltSteps;
//   setValues: Dispatch<SetStateAction<VoltWrapperValuesModel>>;
//   values: VoltWrapperValuesModel;
//   user: IDecodedAccessToken | null;
//   setOpenPropertyDetailWarningModal: Dispatch<SetStateAction<boolean>>;
//   mapInteraction: MapInteractionModel;
//   setMpaInteraction: Dispatch<SetStateAction<MapInteractionModel>>;
//   showAdditionalData?: boolean;
// }

// const getIcon = (el: IPropertyBaseInfo, values: VoltDesktopProps["values"], mapInteraction: VoltDesktopProps["mapInteraction"]) => {
//   if (values.selectedItem?.parcelNumberNoFormatting === el.parcelNumberNoFormatting) {
//     return "active" as const;
//   }
//   if (
//     mapInteraction.hoveredParcelNumber === el.parcelNumberNoFormatting ||
//     mapInteraction.openPopperParcelNumber === el.parcelNumberNoFormatting
//   ) {
//     return "highlighted" as const;
//   }
//   return "default" as const;
// };
// const VoltMap: FC<VoltDesktopProps> = ({
//   step,
//   setValues,
//   values,
//   user,
//   setOpenPropertyDetailWarningModal,
//   mapInteraction,
//   setMpaInteraction,
//   showAdditionalData,
// }) => {
//   const markerRefs = useRef<{ [key: string]: Marker }>();
//   const mapRef = useRef<LeafletMap | null>(null);
//   const { targetReached: isSmallDevice } = useMediaQuery(parseFloat(breakPoints.lg));

//   const mapData = useMemo(() => {
//     if (step === VoltSteps.SEARCH) {
//       return [{ parcelNumber: "test", latitude: 39.8283459, longitude: -98.5794797, center: true, markerType: "none" as const }];
//     }
//     if (step === VoltSteps.SEARCH_RESULTS && values.searchResult) {
//       return values.searchResult?.map((el) => ({
//         parcelNumber: el.parcelNumberNoFormatting || "",
//         latitude: el.lat,
//         longitude: el.lon,
//         polygon: el.polygon,
//         markerType: getIcon(el, values, mapInteraction),
//         popup: (
//           <div className="flex flex-col gap-1 space-y-2">
//             <p className="!p-0 !m-0">
//               Owner: <b>{el.owner}</b>
//             </p>
//             <p className="!p-0 !m-0">
//               Parcel Number: <b>{el.parcelNumberNoFormatting}</b>
//             </p>
//             <p className="!p-0 !m-0">
//               Acreage: <b>{el.acreage.toFixed(2)}</b>
//             </p>
//             {values.searchResult && values.searchResult?.length > 1 && (
//               <Button
//                 className="py-1 h-auto !px-6 ml-auto flex mt-4"
//                 onClick={() => {
//                   setValues((prev) => ({
//                     ...prev,
//                     selectedItem: prev.selectedItem?.parcelNumberNoFormatting === el.parcelNumberNoFormatting ? null : el,
//                   }));
//                 }}
//               >
//                 {values.selectedItem?.parcelNumberNoFormatting === el.parcelNumberNoFormatting ? "Remove" : "Select"}
//               </Button>
//             )}
//           </div>
//         ),
//       }));
//     }
//     if (step === VoltSteps.CALCULATION && values.calculation) {
//       const mainLandSaleHistory: IPropertyUsedForCalculation["data"][] = [];
//       values.calculation.propertiesUsedForCalculation.forEach((property) => {
//         if (property.isBulked) {
//           property.data.properties.forEach((el) => {
//             if (el.parcelNumberNoFormatting === values.calculation?.parcelNumberNoFormatting) {
//               mainLandSaleHistory.push(el);
//             }
//           });
//         } else if (property.data.parcelNumberNoFormatting === values.calculation?.parcelNumberNoFormatting) {
//           mainLandSaleHistory.push(property.data);
//         }
//       });

//       const mainProperty = {
//         parcelNumber: values.calculation.parcelNumber || "",
//         parcelNumberNoFormatting: values.calculation.parcelNumberNoFormatting || "",
//         latitude: Number(values.calculation.lat),
//         longitude: Number(values.calculation.lon),
//         polygon: values.calculation.polygon,
//         markerType: "active" as const,
//         center: true,
//         popup: (
//           <div className="flex flex-col gap-1 space-y-2">
//             <p className="!p-0 !m-0">
//               Owner: <b>{values.calculation.owner}</b>
//             </p>
//             <p className="!p-0 !m-0">
//               Acreage: <b>{Number(values.calculation.acreage).toFixed(2)}</b>
//             </p>
//             <p className="!p-0 !m-0">
//               VOLT Value Per Acreage: <b>{moneyFormatter.format(values.calculation.pricePerAcreage)}</b>
//             </p>
//             {mainLandSaleHistory.length > 0 && (
//               <div className="flex flex-col gap-1">
//                 <p className="!p-0 !m-0 !font-semibold">Sales History:</p>
//                 {mainLandSaleHistory.map((history) => (
//                   <div key={JSON.stringify(history)} className="!mb-1">
//                     <p className="!p-0 !m-0">
//                       Last Sale Date: <b>{moment(history.lastSaleDate).format("MM-DD-YYYY")}</b>
//                     </p>
//                     <p className="!p-0 !m-0">
//                       Sold Price Per Acre: <b>{moneyFormatter.format(history.pricePerAcreage)}</b>
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         ),
//       };
//       let mapItems: Array<{
//         parcelNumber: string;
//         parcelNumberNoFormatting: string;
//         latitude: number;
//         longitude: number;
//         markerType: "highlighted" | "default" | "default-yellow";
//         popup?: ReactElement;
//       }> = [];
//       values.calculation.propertiesUsedForCalculation.forEach((property) => {
//         if (property.isBulked) {
//           property.data.properties.forEach((el) => {
//             mapItems.push({
//               parcelNumber: el.parcelNumberNoFormatting,
//               parcelNumberNoFormatting: el.parcelNumberNoFormatting,
//               latitude: el.lat,
//               longitude: el.lon,
//               markerType: "default" as const,
//               ...(user &&
//                 user.isSubscribed && {
//                   popup: (
//                     <div className="flex flex-col gap-1 space-y-2">
//                       <p className="!p-0 !m-0">
//                         Parcel Number: <b>{el.parcelNumberNoFormatting}</b>
//                       </p>
//                       <p className="!p-0 !m-0">
//                         Acreage: <b>{el.acreage.toFixed(2)}</b>
//                       </p>
//                       <p className="!p-0 !m-0">
//                         Last Sale Date: <b>{moment(el.lastSaleDate).format("MM-DD-YYYY")}</b>
//                       </p>
//                       <p className="!p-0 !m-0">
//                         Sold Price Per Acre: <b>{moneyFormatter.format(el.pricePerAcreage)}</b>
//                       </p>
//                     </div>
//                   ),
//                 }),
//             });
//           });
//         } else {
//           mapItems.push({
//             parcelNumber: property.data.parcelNumberNoFormatting,
//             parcelNumberNoFormatting: property.data.parcelNumberNoFormatting,
//             latitude: property.data.lat,
//             longitude: property.data.lon,
//             markerType: "default" as const,
//             ...(user &&
//               user.isSubscribed && {
//                 popup: (
//                   <div className="flex flex-col gap-1 space-y-2">
//                     <p className="!p-0 !m-0">
//                       Parcel Number: <b>{property.data.parcelNumberNoFormatting}</b>
//                     </p>
//                     <p className="!p-0 !m-0">
//                       Acreage: <b>{property.data.acreage.toFixed(2)}</b>
//                     </p>
//                     <p className="!p-0 !m-0">
//                       Last Sale Date: <b>{moment(property.data.lastSaleDate).format("MM-DD-YYYY")}</b>
//                     </p>
//                     <p className="!p-0 !m-0">
//                       Sold Price Per Acre: <b>{moneyFormatter.format(property.data.pricePerAcreage)}</b>
//                     </p>
//                   </div>
//                 ),
//               }),
//           });
//         }
//       });

//       if (values.additionalDataResult && showAdditionalData && !isSmallDevice) {
//         values.additionalDataResult.propertiesUsedForCalculation.forEach((property) => {
//           if (!property.isBulked) {
//             mapItems.push({
//               parcelNumber: property.data.parcelNumberNoFormatting,
//               parcelNumberNoFormatting: property.data.parcelNumberNoFormatting,
//               latitude: property.data.lat,
//               longitude: property.data.lon,
//               markerType: "default-yellow" as const,
//               ...(user &&
//                 user.isSubscribed && {
//                   popup: (
//                     <div className="flex flex-col gap-1 space-y-2">
//                       <p className="!p-0 !m-0">
//                         Parcel Number: <b>{property.data.parcelNumberNoFormatting}</b>
//                       </p>
//                       <p className="!p-0 !m-0">
//                         Acreage: <b>{property.data.acreage.toFixed(2)}</b>
//                       </p>
//                       <p className="!p-0 !m-0">
//                         Last Sale Date: <b>{moment(property.data.lastSaleDate).format("MM-DD-YYYY")}</b>
//                       </p>
//                       <p className="!p-0 !m-0">
//                         Sold Price Per Acre: <b>{moneyFormatter.format(property.data.pricePerAcreage)}</b>
//                       </p>
//                     </div>
//                   ),
//                 }),
//             });
//           }
//         });
//       }

//       values.calculation.propertiesUsedForCalculation
//         .filter((el) => el.isBulked)
//         .forEach((item) => {
//           mapItems.push({
//             parcelNumber: item.data.parcelNumber,
//             parcelNumberNoFormatting: item.data.parcelNumberNoFormatting,
//             latitude: item.data.properties[0].lat,
//             longitude: item.data.properties[0].lon,
//             markerType: "invisible" as any,
//             ...(user &&
//               user.isSubscribed && {
//                 popup: (
//                   <div className="flex flex-col gap-1 space-y-2">
//                     <h2 className="!font-semibold !mb-3 text-center">Bulk item</h2>
//                     <p className="!p-0 !m-0">
//                       Acreage: <b>{item.data.acreage.toFixed(2)}</b>
//                     </p>
//                     <p className="!p-0 !m-0">
//                       Last Sale Date: <b>{moment(item.data.properties[0].lastSaleDate).format("MM-DD-YYYY")}</b>
//                     </p>
//                     <p className="!p-0 !m-0">
//                       Sold Price Per Acre: <b>{moneyFormatter.format(item.data.pricePerAcreage)}</b>
//                     </p>
//                   </div>
//                 ),
//               }),
//           });
//         });

//       if (mainLandSaleHistory.length > 0) {
//         mapItems = mapItems.filter((el) => !mainLandSaleHistory.find((x) => el.parcelNumberNoFormatting === x.parcelNumberNoFormatting));
//       }
//       return [mainProperty, ...mapItems];
//     }
//     return [];
//   }, [isSmallDevice, mapInteraction, setValues, step, user, values, showAdditionalData]);

//   const canViewDetails = useCallback(
//     (parcelNumberNoFormatting: string) => {
//       if (
//         (user && user.isSubscribed) ||
//         step !== VoltSteps.CALCULATION ||
//         parcelNumberNoFormatting === values.selectedItem?.parcelNumberNoFormatting
//       ) {
//         return true;
//       }
//       return false;
//     },
//     [step, user, values.selectedItem?.parcelNumberNoFormatting]
//   );

//   const handleMapHoverInteraction = useCallback(() => {
//     if (mapRef.current && mapInteraction.hoveredParcelNumber) {
//       const currentZoom = mapRef.current.getZoom();

//       if (mapInteraction.hoveredParcelNumber.includes("multiple")) {
//         const properties = values.calculation?.propertiesUsedForCalculation
//           .filter((el) => el.isBulked)
//           .map((el) => el.data.properties)
//           .flat();

//         const items: IPropertyUsedForCalculation["data"][] = [];
//         mapInteraction.hoveredParcelNumber.split("multiple").forEach((el) => {
//           const item = properties?.find((x) => x.parcelNumberNoFormatting === el);
//           if (item) {
//             items.push(item);
//           }
//         });
//         const centerCoordinate = (getCenter(items.map((el) => ({ latitude: el.lat, longitude: el.lon }))) || {
//           latitude: 0,
//           longitude: 0,
//         }) as any;
//         if (mapInteraction.zoom) {
//           mapRef.current?.fitBounds(
//             [
//               {
//                 lat: centerCoordinate.latitude,
//                 lng: centerCoordinate.longitude,
//               },
//             ] as any,
//             { maxZoom: currentZoom }
//           );
//         }
//       } else {
//         const currentItemMarker = markerRefs.current?.[mapInteraction.hoveredParcelNumber];
//         if (currentItemMarker) {
//           const currentMarkerCoordinate = [currentItemMarker.getLatLng()] as any;
//           if (mapInteraction.zoom) {
//             mapRef.current?.fitBounds(currentMarkerCoordinate, { maxZoom: currentZoom });
//           }
//         }
//       }
//     }
//   }, [mapInteraction.hoveredParcelNumber, mapInteraction.zoom, values.calculation?.propertiesUsedForCalculation]);

//   const handleMapPopperInteraction = useCallback(() => {
//     if (mapRef.current) {
//       if (mapInteraction.openPopperParcelNumber && !mapInteraction.openPopperParcelNumber.includes("multiple")) {
//         const currentItemMarker = markerRefs.current?.[mapInteraction.openPopperParcelNumber];
//         if (currentItemMarker && !currentItemMarker.isPopupOpen()) {
//           currentItemMarker.openPopup();
//           const currentMarkerCoordinate = [currentItemMarker.getLatLng()] as any;
//           if (mapInteraction.zoom) {
//             mapRef.current?.fitBounds(currentMarkerCoordinate, { maxZoom: 14 });
//           }
//         }
//       }

//       if (mapInteraction.openPopperParcelNumber && mapInteraction.openPopperParcelNumber.includes("multiple")) {
//         const properties = values.calculation?.propertiesUsedForCalculation
//           .filter((el) => el.isBulked)
//           .map((el) => el.data.properties)
//           .flat();
//         const items: IPropertyUsedForCalculation["data"][] = [];
//         mapInteraction.openPopperParcelNumber.split("multiple").forEach((el) => {
//           const item = properties?.find((x) => x.parcelNumberNoFormatting === el);
//           if (item) {
//             items.push(item);
//           }
//         });
//         const centerCoordinate = (getCenter(items.map((el) => ({ latitude: el.lat, longitude: el.lon }))) || {
//           latitude: 0,
//           longitude: 0,
//         }) as any;
//         // mapRef.current.closePopup();
//         // if (mapInteraction.zoom) {
//         //   mapRef.current?.fitBounds(
//         //     [
//         //       {
//         //         lat: centerCoordinate.latitude,
//         //         lng: centerCoordinate.longitude,
//         //       },
//         //     ] as any,
//         //     { maxZoom: 14 }
//         //   );
//         // }

//         /// open popup
//         const currentItemMarker = markerRefs.current?.[mapInteraction.openPopperParcelNumber];
//         if (currentItemMarker && !currentItemMarker.isPopupOpen()) {
//           currentItemMarker.openPopup();
//           const currentMarkerCoordinate = [currentItemMarker.getLatLng()] as any;
//           if (mapInteraction.zoom) {
//             mapRef.current?.fitBounds(currentMarkerCoordinate, { maxZoom: 14 });
//           }
//         }
//       }
//     }
//   }, [mapInteraction.openPopperParcelNumber, mapInteraction.zoom, values.calculation?.propertiesUsedForCalculation]);

//   const setMapRef = useCallback((ref: LeafletMap) => {
//     mapRef.current = ref;
//   }, []);

//   const setMarkerRef = useCallback((parcelNumber: string, ref: any) => {
//     markerRefs.current = { ...markerRefs.current, [parcelNumber]: ref };
//   }, []);

//   const mapMarkerMouseEnter = useCallback(
//     (parcelNumberNoFormatting: string) => {
//       setMpaInteraction((prevData) => ({
//         ...prevData,
//         hoveredParcelNumber: parcelNumberNoFormatting,
//         zoom: false,
//       }));
//     },
//     [setMpaInteraction]
//   );

//   const mapMarkerMouseLeave = useCallback(() => {
//     setMpaInteraction((prevData) => ({
//       ...prevData,
//       hoveredParcelNumber: null,
//       zoom: false,
//     }));
//   }, [setMpaInteraction]);

//   const mapPopupOpen = useCallback(
//     (parcelNumberNoFormatting: string) => {
//       setMpaInteraction((prevData) => ({
//         ...prevData,
//         openPopperParcelNumber: parcelNumberNoFormatting,
//         zoom: false,
//       }));
//     },
//     [setMpaInteraction]
//   );

//   const mapPopupClose = useCallback(() => {
//     setMpaInteraction((prevData) => ({
//       ...prevData,
//       openPopperParcelNumber: null,
//       zoom: false,
//     }));
//   }, [setMpaInteraction]);

//   const onMapMarkerClick = useCallback(
//     (parcelNumberNoFormatting: string) => {
//       if (!canViewDetails(parcelNumberNoFormatting)) {
//         setOpenPropertyDetailWarningModal(true);
//       }
//     },
//     [canViewDetails, setOpenPropertyDetailWarningModal]
//   );

//   const setMarkerIcon = useCallback(() => {
//     const highlightedParcelNumbersSet = new Set();

//     if (mapInteraction.openPopperParcelNumber) {
//       if (mapInteraction.openPopperParcelNumber.includes("multiple")) {
//         mapInteraction.openPopperParcelNumber.split("multiple").forEach(highlightedParcelNumbersSet.add, highlightedParcelNumbersSet);
//       } else {
//         highlightedParcelNumbersSet.add(mapInteraction.openPopperParcelNumber);
//       }
//     }
//     if (mapInteraction.hoveredParcelNumber) {
//       if (mapInteraction.hoveredParcelNumber.includes("multiple")) {
//         mapInteraction.hoveredParcelNumber.split("multiple").forEach(highlightedParcelNumbersSet.add, highlightedParcelNumbersSet);
//       } else {
//         highlightedParcelNumbersSet.add(mapInteraction.hoveredParcelNumber);
//       }
//     }

//     if (highlightedParcelNumbersSet.has(values.calculation?.parcelNumberNoFormatting)) {
//       highlightedParcelNumbersSet.delete(values.calculation!.parcelNumberNoFormatting);
//     }

//     if (highlightedParcelNumbersSet.has(values.selectedItem?.parcelNumberNoFormatting)) {
//       highlightedParcelNumbersSet.delete(values.selectedItem!.parcelNumberNoFormatting);
//     }

//     if (markerRefs.current) {
//       Object.keys(markerRefs.current).forEach((parcelNumberNoFormatting) => {
//         const marker = markerRefs.current?.[parcelNumberNoFormatting as keyof typeof markerRefs.current];
//         const markerIcon = marker?.getIcon().options;
//         if (
//           parcelNumberNoFormatting !== values.calculation?.parcelNumberNoFormatting &&
//           parcelNumberNoFormatting !== values.selectedItem?.parcelNumberNoFormatting &&
//           !highlightedParcelNumbersSet.has(parcelNumberNoFormatting) &&
//           markerIcon?.iconUrl?.includes("highlighted")
//         ) {
//           marker?.setIcon(markerIcon?.iconUrl.includes("orange") ? markerDefaultYellow : markerDefault);
//         }
//       });
//     }

//     Array.from(highlightedParcelNumbersSet).forEach((el) => {
//       const marker = markerRefs.current?.[el as keyof typeof markerRefs.current];
//       const markerIcon = marker?.getIcon().options;

//       if (marker) {
//         marker.setIcon(markerIcon?.iconUrl?.includes("orange") ? markerHighlightedYellow : markerHighlighted);
//       }
//     });
//   }, [mapInteraction.hoveredParcelNumber, mapInteraction.openPopperParcelNumber, values.calculation, values.selectedItem]);

//   useEffect(() => {
//     setMarkerIcon();
//   }, [mapInteraction, setMarkerIcon]);

//   useEffect(() => {
//     handleMapHoverInteraction();
//   }, [handleMapHoverInteraction, mapInteraction.hoveredParcelNumber, mapInteraction.zoom]);

//   useEffect(() => {
//     handleMapPopperInteraction();
//   }, [handleMapPopperInteraction, mapInteraction.openPopperParcelNumber, mapInteraction.zoom]);

//   return (
//     <Map
//       properties={mapData}
//       // eslint-disable-next-line no-nested-ternary
//       zoom={step === VoltSteps.SEARCH ? 5 : step === VoltSteps.SEARCH_RESULTS && values.searchResult?.length === 1 ? 16 : 8}
//       dragging={step !== VoltSteps.SEARCH}
//       disableZoom={step === VoltSteps.SEARCH}
//       setMarkerRef={setMarkerRef}
//       markerMouseEnter={mapMarkerMouseEnter}
//       markerMouseLeave={mapMarkerMouseLeave}
//       popupOpen={mapPopupOpen}
//       popupClose={mapPopupClose}
//       onMarkerClick={onMapMarkerClick}
//       setMapRef={setMapRef}
//     />
//   );
// };

// export default VoltMap;

"use client";

import React, { Dispatch, FC, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import useMap from "@/hooks/useMap";
import dynamic from "next/dynamic";
import { VoltSteps, VoltWrapperValuesModel } from "@/types/volt";
import { IDecodedAccessToken } from "@/types/auth";
import { MapInteractionModel } from "@/types/common";
import { MapGeoJson } from "@/types/mapbox";
import { mapDefaultMarkers } from "@/lib/map";
import { center } from "@turf/center";
import * as turf from "@turf/turf";
import { uuid } from "short-uuid";
import { Button } from "../ui/button";

const MapComponent = dynamic(() => import("@/components/maps/mapbox/mapbox-base"), { ssr: false });

interface VoltMapProps {
  step: VoltSteps;
  setValues: Dispatch<SetStateAction<VoltWrapperValuesModel>>;
  values: VoltWrapperValuesModel;
  user: IDecodedAccessToken | null;
  setOpenPropertyDetailWarningModal: Dispatch<SetStateAction<boolean>>;
  mapInteraction: MapInteractionModel;
  setMpaInteraction: Dispatch<SetStateAction<MapInteractionModel>>;
  showAdditionalData?: boolean;
}

const VoltMap: FC<VoltMapProps> = ({
  step,
  mapInteraction,
  setMpaInteraction,
  setOpenPropertyDetailWarningModal,
  setValues,
  user,
  values,
  showAdditionalData,
}) => {
  const { ref, setRef, addMarkerImages, setGeoJson, showRegridTiles, showMarkers, openPopup, geoJson, highlightFeatures, loaded } =
    useMap();

  const searchResultPopupRef = useRef<HTMLDivElement>(null);
  const [searchResultPopupDetails, setSearchResultPopupDetails] = useState<{
    owner: string;
    acreage: number;
    parcelNumberNoFormatting: string;
  } | null>(null);

  const toggleMapOptions = useCallback(() => {
    if (!ref) {
      return;
    }
    if (ref.scrollZoom.isEnabled()) {
      ref.scrollZoom.disable();
    } else {
      ref.scrollZoom.enable();
    }

    if (ref.dragPan.isEnabled()) {
      ref.dragPan.disable();
    } else {
      ref.dragPan.enable();
    }

    if (ref.doubleClickZoom.isEnabled()) {
      ref.doubleClickZoom.disable();
    } else {
      ref.doubleClickZoom.enable();
    }
  }, [ref]);

  const showSearchResult = useCallback(() => {
    if (step === VoltSteps.SEARCH_RESULTS && values.searchResult && ref) {
      const geoJsonInit: MapGeoJson = {
        type: "FeatureCollection",
        features: [],
      };
      values.searchResult.forEach((feature) => {
        geoJsonInit.features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [feature.lon, feature.lat],
          },
          properties: {
            id: uuid(),
            owner: feature.owner,
            parcelNumberNoFormatting: feature.parcelNumberNoFormatting,
            parcelNumber: feature.parcelNumber,
            lng: feature.lon,
            lat: feature.lat,
            type: "selling",
            markerIcon: values.searchResult?.length === 1 ? "selling" : "red",
            hoveredMarkerIcon: values.searchResult?.length === 1 ? "selling" : "redHighlighted",
            selectedMarkerIcon: "selling",
            markerSize: values.searchResult?.length === 1 ? 1.5 : 1,
            hoveredMarkerSize: values.searchResult?.length === 1 ? 1.5 : 1.2,
            selectedMarkerSize: values.searchResult?.length === 1 ? 1.5 : 1.2,
            acreage: feature.acreage,
            polygonLineColor: "#05471C",
            polygonFillColor: "#05471C",
          },
        });
      });

      setGeoJson(geoJsonInit);
      showMarkers({
        onMarkerMouseEnter: (parcelNumberNoFormatting) => {
          setMpaInteraction((prev) => ({ ...prev, hoveredParcelNumber: parcelNumberNoFormatting }));
        },
        onMarkerMouseLeave: () => {
          setMpaInteraction((prev) => ({ ...prev, hoveredParcelNumber: null }));
        },
        onClick: (parcelNumberNoFormatting) => {
          setMpaInteraction((prev) => ({
            ...prev,
            openPopperParcelNumber: parcelNumberNoFormatting,
          }));
        },
        cluster: geoJsonInit.features.length > 100,
      });
      showRegridTiles({
        onMarkerMouseEnter: (parcelNumberNoFormatting) => {
          setMpaInteraction((prev) => ({ ...prev, hoveredParcelNumber: parcelNumberNoFormatting }));
        },
        onMarkerMouseLeave: () => {
          setMpaInteraction((prev) => ({ ...prev, hoveredParcelNumber: null }));
        },
        onClick: (parcelNumberNoFormatting) => {
          setMpaInteraction((prev) => ({
            ...prev,
            openPopperParcelNumber: parcelNumberNoFormatting,
          }));
        },
      });

      const features = turf.points([...values.searchResult.map((el) => [el.lon, el.lat])]);

      const center = turf.center(features);
      ref.setCenter(center.geometry.coordinates as any);
      ref.setZoom(8);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openPopup, ref, setGeoJson, showMarkers, showRegridTiles, step, values.searchResult]);

  const handleMarkerInteractions = useCallback(() => {
    if (loaded) {
      const data: any = [];

      if (mapInteraction.hoveredParcelNumber) {
        mapInteraction.hoveredParcelNumber.split("multiple").forEach((el) => {
          data.push({ [el]: "hovered" });
        });
      }

      if (mapInteraction.openPopperParcelNumber) {
        mapInteraction.openPopperParcelNumber.split("multiple").forEach((el) => {
          data.push({ [el]: "selected" });
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
            popupRef: step === VoltSteps.SEARCH_RESULTS && searchResultPopupRef.current,
          });

          if (step === VoltSteps.SEARCH_RESULTS) {
            setSearchResultPopupDetails({
              owner: feature.properties.owner || "",
              acreage: Number(feature.properties.acreage),
              parcelNumberNoFormatting: feature.properties.parcelNumberNoFormatting,
            });
          }
        }
      }
      highlightFeatures(data);
    }
  }, [
    geoJson.features,
    highlightFeatures,
    loaded,
    mapInteraction.hoveredParcelNumber,
    mapInteraction.openPopperParcelNumber,
    openPopup,
    setMpaInteraction,
    step,
  ]);

  // useEffect(() => {
  //   toggleMapOptions();
  // }, [toggleMapOptions]);

  // useEffect(() => {
  //   if (ref) {
  //     if (step > VoltSteps.SEARCH) {
  //       toggleMapOptions();
  //     }
  //   }
  // }, [ref, step, toggleMapOptions]);

  useEffect(() => {
    if (ref) {
      addMarkerImages(mapDefaultMarkers);
    }
  }, [ref, addMarkerImages]);

  useEffect(() => {
    showSearchResult();
  }, [showSearchResult]);

  useEffect(() => {
    handleMarkerInteractions();
  }, [handleMarkerInteractions]);

  return (
    <>
      <div style={{ display: "none" }}>
        <div ref={searchResultPopupRef}>
          {searchResultPopupDetails && (
            <ul className="">
              <>
                <li className="text-xs text-grey-800 py-0.5">
                  Parcel Number <span className="text-black font-semibold">{searchResultPopupDetails.parcelNumberNoFormatting}</span>
                </li>
                <li className="text-xs text-grey-800 py-0.5">
                  Owner <span className="text-black font-semibold">{searchResultPopupDetails.owner}</span>
                </li>
                <li className="text-xs text-grey-800 py-0.5">
                  Acreage <span className="text-black font-semibold">{searchResultPopupDetails.acreage}</span>
                </li>
                {values.searchResult && values.searchResult?.length > 1 && (
                  <Button
                    className="py-1 h-auto !px-6 ml-auto flex mt-4"
                    onClick={() => {
                      setValues((prev) => ({
                        ...prev,
                        selectedItem:
                          prev.selectedItem?.parcelNumberNoFormatting === searchResultPopupDetails.parcelNumberNoFormatting
                            ? null
                            : values.searchResult?.find(
                                (el) => el.parcelNumberNoFormatting === searchResultPopupDetails.parcelNumberNoFormatting
                              ) || null,
                      }));
                    }}
                  >
                    {values.selectedItem?.parcelNumberNoFormatting === searchResultPopupDetails.parcelNumberNoFormatting
                      ? "Remove"
                      : "Select"}
                  </Button>
                )}
              </>
            </ul>
          )}
        </div>
      </div>
      <MapComponent ref={ref} setRef={setRef} />
    </>
  );
};

export default VoltMap;
