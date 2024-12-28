"use client";

import dynamic from "next/dynamic";
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
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
  // const [openParcelData, setOpenParcelData] = useState<IFeature | null>(null);

  // const onMarkerClick = useCallback((feature: GeoJSONFeature, ref: MapBoX) => {
  //   const properties = feature.properties as IFeature;

  //   if (properties.type === PropertyTypeEnum.primary) {
  //   } else {
  //     setOpenParcelData(properties);
  //   }

  //   if (popupRef.current) {
  //     new Popup({ closeButton: false, className: "[&>div:last-child]:rounded-xl [&>div:last-child]:shadow-4 [&>div:last-child]:p-3" })
  //       .setLngLat([properties.lng, properties.lat])
  //       .setDOMContent(popupRef.current)
  //       .addTo(ref)
  //       .on("close", () => {
  //         setOpenParcelData(null);
  //       });
  //   }
  // }, []);

  const { ref, setRef, setGeoJson, addMarkerImages, loaded, showMarkers, highlightFeatures } = useMap();

  const initiateMap = useCallback(async () => {
    if (loaded) {
      const { lat, lon, parcelNumberNoFormatting, propertiesUsedForCalculation, acreage, parcelNumber, price, pricePerAcreage } = data;
      const geoJson: MapGeoJson = {
        type: "FeatureCollection",
        features: [],
      };

      geoJson.features.push({
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
        },
      });

      data.propertiesUsedForCalculation.forEach((property) => {
        if (property.isBulked) {
          property.data.properties.forEach((bulkedProperty) => {
            geoJson.features.push({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [bulkedProperty.lon, bulkedProperty.lat],
              },
              properties: {
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
              },
            });
          });
        } else {
          geoJson.features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [property.data.lon, property.data.lat],
            },
            properties: {
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
            },
          });
        }
      });

      additionalDataResult?.propertiesUsedForCalculation.forEach((property) => {
        if (property.isBulked) {
          property.data.properties.forEach((bulkedProperty) => {
            geoJson.features.push({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [bulkedProperty.lon, bulkedProperty.lat],
              },
              properties: {
                parcelNumberNoFormatting: bulkedProperty.parcelNumberNoFormatting,
                parcelNumber: bulkedProperty.parcelNumber,
                lng: bulkedProperty.lon,
                lat: bulkedProperty.lat,
                type: "calculation-valid",
                acreage: property.data.acreage,
                bulkId: property.data.id,
                markerIcon: "yellow",
                hoveredMarkerIcon: "yellowHighlighted",
                selectedMarkerIcon: "yellowHighlighted",
                markerSize: 1,
                hoveredMarkerSize: 1.2,
                selectedMarkerSize: 1.2,
              },
            });
          });
        } else {
          geoJson.features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [property.data.lon, property.data.lat],
            },
            properties: {
              parcelNumberNoFormatting: property.data.parcelNumberNoFormatting,
              parcelNumber: property.data.parcelNumber,
              lng: property.data.lon,
              lat: property.data.lat,
              type: "calculation-valid",
              markerIcon: "yellow",
              acreage: property.data.acreage,
              hoveredMarkerIcon: "yellowHighlighted",
              selectedMarkerIcon: "yellowHighlighted",
              markerSize: 1,
              hoveredMarkerSize: 30,
              selectedMarkerSize: 1.2,
            },
          });
        }
      });
      addMarkerImages(mapDefaultMarkers);
      setGeoJson(geoJson);
      showMarkers({
        onMarkerMouseEnter: (parcelNumberNoFormatting) => {
          setMpaInteraction((prev) => ({ ...prev, hoveredParcelNumber: parcelNumberNoFormatting }));
        },
        onMarkerMouseLeave: () => {
          setMpaInteraction((prev) => ({ ...prev, hoveredParcelNumber: null }));
        },
      });

      ref?.setCenter([data.lon, data.lat]);
      ref?.setZoom(8);
    }
  }, [loaded, data, additionalDataResult?.propertiesUsedForCalculation, addMarkerImages, setGeoJson, showMarkers, ref, setMpaInteraction]);

  const handleMarkerInteractions = useCallback(() => {
    if (loaded) {
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
      }

      highlightFeatures(data);
    }
  }, [highlightFeatures, loaded, mapInteraction.hoveredParcelNumber, mapInteraction.openPopperParcelNumber]);

  useEffect(() => {
    handleMarkerInteractions();
  }, [handleMarkerInteractions]);

  useEffect(() => {
    initiateMap();
  }, [initiateMap]);

  // const styles = [
  //   "mapbox://styles/mapbox/standard",
  //   "mapbox://styles/mapbox/standard-satellite",
  //   "mapbox://styles/mapbox/streets-v12",
  //   "mapbox://styles/mapbox/outdoors-v12",
  //   "mapbox://styles/mapbox/light-v11",
  //   "mapbox://styles/mapbox/dark-v11",
  //   "mapbox://styles/mapbox/satellite-v9",
  //   "mapbox://styles/mapbox/satellite-streets-v12",
  //   "mapbox://styles/mapbox/navigation-day-v1",
  //   "mapbox://styles/mapbox/navigation-night-v1",
  // ];

  return (
    <>
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
      <MapComponent ref={ref} setRef={setRef} />
      {/* </div> */}
    </>
  );
};

export default SearchItemDetailsDesktopMap;
