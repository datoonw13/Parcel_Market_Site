// "use client";

// import { Icon, Map as LeafletMap, Marker } from "leaflet";
// import dynamic from "next/dynamic";
// import { Dispatch, FC, memo, ReactElement, SetStateAction, useCallback, useEffect, useMemo, useRef } from "react";
// import { moneyFormatter } from "@/helpers/common";
// import { IDecodedAccessToken } from "@/types/auth";
// import { MapInteractionModel } from "@/types/common";
// import moment from "moment";
// import { IUserRecentSearches } from "@/types/user";
// import { IPropertyUsedForCalculation } from "@/types/property";
// import { getCenter } from "geolib";

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
//   data: IUserRecentSearches;
//   user: IDecodedAccessToken | null;
//   openWarningModal: () => void;
//   mapInteraction: MapInteractionModel;
//   setMpaInteraction: Dispatch<SetStateAction<MapInteractionModel>>;
//   additionalDataResult?: IUserRecentSearches;
// }

// const SearchItemDetailsDesktopMap: FC<VoltDesktopProps> = ({
//   user,
//   openWarningModal,
//   mapInteraction,
//   setMpaInteraction,
//   data,
//   additionalDataResult,
// }) => {
//   const markerRefs = useRef<{ [key: string]: Marker }>();
//   const ref = useRef<LeafletMap | null>(null);

//   const mapData = useMemo(() => {
//     const mainLandSaleHistory: IPropertyUsedForCalculation["data"][] = [];
//     data.propertiesUsedForCalculation.forEach((property) => {
//       if (property.isBulked) {
//         property.data.properties.forEach((el) => {
//           if (el.parcelNumberNoFormatting === data.parcelNumberNoFormatting) {
//             mainLandSaleHistory.push(el);
//           }
//         });
//       } else if (property.data.parcelNumberNoFormatting === data.parcelNumberNoFormatting) {
//         mainLandSaleHistory.push(property.data);
//       }
//     });

//     const mainProperty = {
//       parcelNumber: data.parcelNumber || "",
//       parcelNumberNoFormatting: data.parcelNumberNoFormatting || "",
//       latitude: Number(data.lat),
//       longitude: Number(data.lon),
//       polygon: data.polygon,
//       markerType: "active" as const,
//       center: true,
//       popup: (
//         <div className="flex flex-col gap-1 space-y-2">
//           <p className="!p-0 !m-0">
//             Owner: <b>{data.owner}</b>
//           </p>
//           <p className="!p-0 !m-0">
//             Acreage: <b>{Number(data.acreage).toFixed(2)}</b>
//           </p>
//           <p className="!p-0 !m-0">
//             VOLT Value Per Acreage: <b>{moneyFormatter.format(data.pricePerAcreage)}</b>
//           </p>
//           {mainLandSaleHistory.length > 0 && (
//             <div className="flex flex-col gap-1">
//               <p className="!p-0 !m-0 !font-semibold">Sales History:</p>
//               {mainLandSaleHistory.map((history) => (
//                 <div key={JSON.stringify(history)} className="!mb-1">
//                   <p className="!p-0 !m-0">
//                     Last Sale Date: <b>{moment(history.lastSaleDate).format("MM-DD-YYYY")}</b>
//                   </p>
//                   <p className="!p-0 !m-0">
//                     Sold Price Per Acre: <b>{moneyFormatter.format(history.pricePerAcreage)}</b>
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ),
//     };
//     let mapItems: Array<{
//       parcelNumber: string;
//       parcelNumberNoFormatting: string;
//       latitude: number;
//       longitude: number;
//       markerType: "highlighted" | "default" | "default-yellow";
//       popup?: ReactElement;
//     }> = [];
//     data.propertiesUsedForCalculation.forEach((property) => {
//       if (property.isBulked) {
//         property.data.properties.forEach((el) => {
//           mapItems.push({
//             parcelNumber: el.parcelNumberNoFormatting,
//             parcelNumberNoFormatting: el.parcelNumberNoFormatting,
//             latitude: el.lat,
//             longitude: el.lon,
//             markerType: "default" as const,
//             ...(user &&
//               user.isSubscribed && {
//                 popup: (
//                   <div className="flex flex-col gap-1 space-y-2">
//                     <p className="!p-0 !m-0">
//                       Parcel Number: <b>{el.parcelNumberNoFormatting}</b>
//                     </p>
//                     <p className="!p-0 !m-0">
//                       Acreage: <b>{el.acreage.toFixed(2)}</b>
//                     </p>
//                     <p className="!p-0 !m-0">
//                       Last Sale Date: <b>{moment(el.lastSaleDate).format("MM-DD-YYYY")}</b>
//                     </p>
//                     <p className="!p-0 !m-0">
//                       Sold Price Per Acre: <b>{moneyFormatter.format(el.pricePerAcreage)}</b>
//                     </p>
//                   </div>
//                 ),
//               }),
//           });
//         });
//       } else {
//         mapItems.push({
//           parcelNumber: property.data.parcelNumberNoFormatting,
//           parcelNumberNoFormatting: property.data.parcelNumberNoFormatting,
//           latitude: property.data.lat,
//           longitude: property.data.lon,
//           markerType: "default" as const,
//           ...(user &&
//             user.isSubscribed && {
//               popup: (
//                 <div className="flex flex-col gap-1 space-y-2">
//                   <p className="!p-0 !m-0">
//                     Parcel Number: <b>{property.data.parcelNumberNoFormatting}</b>
//                   </p>
//                   <p className="!p-0 !m-0">
//                     Acreage: <b>{property.data.acreage.toFixed(2)}</b>
//                   </p>
//                   <p className="!p-0 !m-0">
//                     Last Sale Date: <b>{moment(property.data.lastSaleDate).format("MM-DD-YYYY")}</b>
//                   </p>
//                   <p className="!p-0 !m-0">
//                     Sold Price Per Acre: <b>{moneyFormatter.format(property.data.pricePerAcreage)}</b>
//                   </p>
//                 </div>
//               ),
//             }),
//         });
//       }
//     });
//     if (additionalDataResult) {
//       additionalDataResult?.propertiesUsedForCalculation.forEach((property) => {
//         if (!property.isBulked) {
//           mapItems.push({
//             parcelNumber: property.data.parcelNumberNoFormatting,
//             parcelNumberNoFormatting: property.data.parcelNumberNoFormatting,
//             latitude: property.data.lat,
//             longitude: property.data.lon,
//             markerType: "default-yellow" as const,
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
//     }

//     data.propertiesUsedForCalculation
//       .filter((el) => el.isBulked)
//       .forEach((item) => {
//         mapItems.push({
//           parcelNumber: item.data.parcelNumber,
//           parcelNumberNoFormatting: item.data.parcelNumberNoFormatting,
//           latitude: item.data.properties[0].lat,
//           longitude: item.data.properties[0].lon,
//           markerType: "invisible" as any,
//           ...(user &&
//             user.isSubscribed && {
//               popup: (
//                 <div className="flex flex-col gap-1 space-y-2">
//                   <h2 className="!font-semibold !mb-3 text-center">Bulk item</h2>
//                   <p className="!p-0 !m-0">
//                     Acreage: <b>{item.data.acreage.toFixed(2)}</b>
//                   </p>
//                   <p className="!p-0 !m-0">
//                     Last Sale Date: <b>{moment(item.data.properties[0].lastSaleDate).format("MM-DD-YYYY")}</b>
//                   </p>
//                   <p className="!p-0 !m-0">
//                     Sold Price Per Acre: <b>{moneyFormatter.format(item.data.pricePerAcreage)}</b>
//                   </p>
//                 </div>
//               ),
//             }),
//         });
//       });

//     if (mainLandSaleHistory.length > 0) {
//       mapItems = mapItems.filter((el) => !mainLandSaleHistory.find((x) => el.parcelNumberNoFormatting === x.parcelNumberNoFormatting));
//     }
//     return [mainProperty, ...mapItems];
//   }, [
//     additionalDataResult,
//     data.acreage,
//     data.lat,
//     data.lon,
//     data.owner,
//     data.parcelNumber,
//     data.parcelNumberNoFormatting,
//     data.polygon,
//     data.pricePerAcreage,
//     data.propertiesUsedForCalculation,
//     user,
//   ]);

//   const canViewDetails = useCallback(
//     (parcelNumberNoFormatting: string) => {
//       if ((user && user.isSubscribed) || parcelNumberNoFormatting === data.parcelNumberNoFormatting) {
//         return true;
//       }
//       return false;
//     },
//     [data.parcelNumberNoFormatting, user]
//   );

//   const handleMapHoverInteraction = useCallback(() => {
//     if (mapRef.current && mapInteraction.hoveredParcelNumber) {
//       const currentZoom = mapRef.current.getZoom();
//       if (mapInteraction.hoveredParcelNumber.includes("multiple")) {
//         const properties = data.propertiesUsedForCalculation
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
//   }, [data.propertiesUsedForCalculation, mapInteraction.hoveredParcelNumber, mapInteraction.zoom]);

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
//         const properties = data.propertiesUsedForCalculation
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
//   }, [data.propertiesUsedForCalculation, mapInteraction.openPopperParcelNumber, mapInteraction.zoom]);

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
//         openWarningModal();
//       }
//     },
//     [canViewDetails, openWarningModal]
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

//     if (highlightedParcelNumbersSet.has(data.parcelNumberNoFormatting)) {
//       highlightedParcelNumbersSet.delete(data.parcelNumberNoFormatting);
//     }

//     if (markerRefs.current) {
//       Object.keys(markerRefs.current).forEach((parcelNumberNoFormatting) => {
//         const marker = markerRefs.current?.[parcelNumberNoFormatting as keyof typeof markerRefs.current];
//         const markerIcon = marker?.getIcon().options;
//         if (
//           parcelNumberNoFormatting !== data.parcelNumberNoFormatting &&
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
//   }, [data.parcelNumberNoFormatting, mapInteraction.hoveredParcelNumber, mapInteraction.openPopperParcelNumber]);

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
//       zoom={8}
//       dragging
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

// export default memo(SearchItemDetailsDesktopMap);

"use client";

import dynamic from "next/dynamic";
import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from "react";
import { IUserRecentSearches } from "@/types/user";
import { IDecodedAccessToken } from "@/types/auth";
import { MapInteractionModel } from "@/types/common";
import useMap from "@/hooks/useMap";
import { GeoJSONSourceSpecification, Map as MapBox, SourceSpecification } from "mapbox-gl";
import { Feature, GeoJsonObject, GeoJsonProperties, Geometry, Position } from "geojson";

const Map = dynamic(() => import("@/components/maps/mapbox/mapbox-base"), { ssr: false });

const markerImages = {
  primary: "/map-default-icon.svg",
  primaryHighlighted: "/map-highlighted-icon.svg",
  secondary: "/map-default-orange-icon.svg",
  secondaryHighlighted: "/map-highlighted-orange-icon.svg",
  active: "/map-active-icon.svg",
};

const createMarkerImage = (type: keyof typeof markerImages) => {
  const el = document.createElement("img");
  const width = 28;
  const height = 36;
  el.src = `${markerImages[type]}`;
  el.style.width = `${width}px`;
  el.style.height = `${height}px`;
  el.style.backgroundSize = "100%";
  el.style.backgroundRepeat = "no-repeat";
  return el;
};

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
  const { ref, setRef, selectedFeatureId, loaded } = useMap();
  const [geoJson, setGeoJson] = useState<GeoJSONSourceSpecification["data"] | null>(null);

  useEffect(() => {
    const generateIdGeoJson: GeoJSONSourceSpecification["data"] = {
      type: "FeatureCollection",
      features: [],
    };
    generateIdGeoJson.features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [data.lon, data.lat],
      },
      properties: {
        type: "selling-property",
        owner: data.owner,
        acreage: data.acreage,
        pricePerAcreage: data.pricePerAcreage,
        price: data.price,
        parcelNumber: data.parcelNumberNoFormatting,
      },
    });
    generateIdGeoJson.features.push({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: data.polygon as any,
      },
      properties: {
        type: "selling-property",
        owner: data.owner,
        parcelNumber: data.parcelNumberNoFormatting,
      },
    });
    data.propertiesUsedForCalculation.forEach((property) => {
      if (property.isBulked) {
        property.data.properties.forEach((childProperty) => {
          generateIdGeoJson.features.push({
            id: childProperty.parcelNumberNoFormatting,
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [childProperty.lon, childProperty.lat],
            },
            properties: {
              type: "used-for-calc",
              acreage: childProperty.acreage,
              pricePerAcreage: childProperty.pricePerAcreage,
              lastSaleDate: childProperty.lastSaleDate,
              lastSalePrice: childProperty.lastSalePrice,
              isBulked: true,
              bulkId: property.data.parcelNumberNoFormatting,
              parcelNumber: childProperty.parcelNumberNoFormatting,
            },
          });
        });
      } else {
        generateIdGeoJson.features.push({
          id: property.data.parcelNumberNoFormatting,
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [property.data.lon, property.data.lat],
          },
          properties: {
            type: "used-for-calc",
            acreage: property.data.acreage,
            pricePerAcreage: property.data.pricePerAcreage,
            lastSaleDate: property.data.lastSaleDate,
            lastSalePrice: property.data.lastSalePrice,
            isBulked: false,
            parcelNumber: property.data.parcelNumberNoFormatting,
          },
        });
      }
    });

    additionalDataResult?.propertiesUsedForCalculation.forEach((property) => {
      if (property.isBulked) {
        property.data.properties.forEach((childProperty) => {
          generateIdGeoJson.features.push({
            id: childProperty.parcelNumberNoFormatting,
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [childProperty.lon, childProperty.lat],
            },
            properties: {
              type: "additional-data",
              acreage: childProperty.acreage,
              pricePerAcreage: childProperty.pricePerAcreage,
              lastSaleDate: childProperty.lastSaleDate,
              lastSalePrice: childProperty.lastSalePrice,
              isBulked: true,
              bulkId: property.data.parcelNumberNoFormatting,
              parcelNumber: childProperty.parcelNumberNoFormatting,
            },
          });
        });
      } else {
        generateIdGeoJson.features.push({
          id: property.data.parcelNumberNoFormatting,
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [property.data.lon, property.data.lat],
          },
          properties: {
            type: "additional-data",
            acreage: property.data.acreage,
            pricePerAcreage: property.data.pricePerAcreage,
            lastSaleDate: property.data.lastSaleDate,
            lastSalePrice: property.data.lastSalePrice,
            parcelNumber: property.data.parcelNumberNoFormatting,
            isBulked: false,
          },
        });
      }
    });
    setGeoJson(generateIdGeoJson);
  }, [additionalDataResult?.propertiesUsedForCalculation, data]);

  useEffect(() => {
    if (loaded && ref && geoJson) {
      // ref.addSource("earthquakes", {
      //   type: "geojson",
      //   data: `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&eventtype=earthquake&minmagnitude=1&starttime=2024-12-12T12:46:25.276Z`, // Use the sevenDaysAgo variable to only retrieve quakes from the past week
      //   generateId: true, // This ensures that all features have unique IDs
      // });
      // ref.addLayer({
      //   id: "earthquakes-viz",
      //   type: "circle",
      //   source: "earthquakes",
      // paint: {
      //   // The feature-state dependent circle-radius expression will render
      //   // the radius size according to its magnitude when
      //   // a feature's hover state is set to true
      //   "circle-radius": [
      //     "case",
      //     ["boolean", ["feature-state", "hover"], false],
      //     ["interpolate", ["linear"], ["get", "mag"], 1, 8, 1.5, 10, 2, 12, 2.5, 14, 3, 16, 3.5, 18, 4.5, 20, 6.5, 22, 8.5, 24, 10.5, 26],
      //     5,
      //   ],
      //   "circle-stroke-color": "#000",
      //   "circle-stroke-width": 1,
      //   // The feature-state dependent circle-color expression will render
      //   // the color according to its magnitude when
      //   // a feature's hover state is set to true
      //   "circle-color": [
      //     "case",
      //     ["boolean", ["feature-state", "hover"], false],
      //     [
      //       "interpolate",
      //       ["linear"],
      //       ["get", "mag"],
      //       1,
      //       "#fff7ec",
      //       1.5,
      //       "#fee8c8",
      //       2,
      //       "#fdd49e",
      //       2.5,
      //       "#fdbb84",
      //       3,
      //       "#fc8d59",
      //       3.5,
      //       "#ef6548",
      //       4.5,
      //       "#d7301f",
      //       6.5,
      //       "#b30000",
      //       8.5,
      //       "#7f0000",
      //       10.5,
      //       "#000",
      //     ],
      //     "#000",
      //   ],
      // },
      // });

      // ref.on("mousemove", "earthquakes-viz", (event) => {
      //   ref.getCanvas().style.cursor = "pointer";
      //   if (event.features?.[0].id) {
      //     if (selectedFeatureId.current) {
      //       ref.removeFeatureState({
      //         source: "earthquakes",
      //         id: selectedFeatureId.current,
      //       });
      //     }

      //     selectedFeatureId.current = event.features[0].id;
      //     ref.setFeatureState(
      //       {
      //         source: "earthquakes",
      //         id: selectedFeatureId.current,
      //       },
      //       {
      //         hover: true,
      //       }
      //     );
      //   }
      // });

      // ref.on("mouseleave", "earthquakes-viz", () => {
      //   if (selectedFeatureId.current) {
      //     ref.setFeatureState(
      //       {
      //         source: "earthquakes",
      //         id: selectedFeatureId.current,
      //       },
      //       {
      //         hover: false,
      //       }
      //     );
      //   }

      //   // quakeID = null;
      //   // Remove the information from the previously hovered feature from the sidebar
      //   // magDisplay.textContent = "";
      //   // locDisplay.textContent = "";
      //   // dateDisplay.textContent = "";
      //   // Reset the cursor style
      //   ref.getCanvas().style.cursor = "";
      // });

      ref.addSource("properties", {
        type: "geojson",
        data: geoJson,
        generateId: true, // This ensures that all features have unique IDs
        cluster: false,
      });

      ref.addLayer({
        id: "properties-used-for-calc",
        type: "symbol",
        source: "properties",
        filter: ["all", ["==", "type", "used-for-calc"]],
        layout: {
          "icon-image": "primary",
          "icon-size": 1,
          "icon-allow-overlap": true,
        },
      });

      ref.addLayer({
        id: "properties-additional-data",
        type: "symbol",
        source: "properties",
        filter: ["all", ["==", "type", "additional-data"]],
        layout: {
          "icon-allow-overlap": true,
          "icon-image": "secondary",
          // "icon-size": 1,
          "circle-sort-key": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            [
              "interpolate",
              ["linear"],
              ["get", "mag"],
              1,
              "#fff7ec",
              1.5,
              "#fee8c8",
              2,
              "#fdd49e",
              2.5,
              "#fdbb84",
              3,
              "#fc8d59",
              3.5,
              "#ef6548",
              4.5,
              "#d7301f",
              6.5,
              "#b30000",
              8.5,
              "#7f0000",
              10.5,
              "#000",
            ],
            "#000",
          ],
        },
      });

      ref.addLayer({
        id: "properties-selling-property",
        type: "symbol",
        source: "properties",
        filter: ["all", ["==", "type", "selling-property"]],
        layout: {
          "icon-image": "active",
          "icon-size": 1.5,
        },
      });

      ref.on("mouseenter", "properties-used-for-calc", (event) => {
        ref.getCanvas().style.cursor = "pointer";
        const feature = event.features?.[0];
        if (feature) {
          if (feature?.properties?.isBulked) {
            console.log(feature.properties.bulkId.split("multiple"));
            ref
              .querySourceFeatures("properties", {
                filter: ["all", ["==", "bulkId", feature.properties.bulkId]],
              })
              .forEach((feature) => {
                ref.setFeatureState(feature, {
                  
                });
              });
          }

          // ref.setLayoutProperty("properties-used-for-calc", "icon-image", [
          //   "match",
          //   ["id"], // get the feature id (make sure your data has an id set or use generateIds for GeoJSON sources
          //   feature.id,
          //   "primaryHighlighted", // image when id is the clicked feature id
          //   "primary", // default
          // ]);
        }
      });

      ref.setCenter([data.lon, data.lat]);
      ref.setZoom(10);
    }
  }, [loaded, ref, geoJson, data.lon, data.lat]);
  return (
    <>
      <Map ref={ref} setRef={setRef} />
    </>
  );
};

export default SearchItemDetailsDesktopMap;
