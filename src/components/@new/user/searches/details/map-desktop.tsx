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
import { IFeature, PropertyTypeEnum } from "@/types/mapbox";

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
  const [openParcelData, setOpenParcelData] = useState<IFeature | null>(null);

  const onMarkerClick = useCallback((feature: GeoJSONFeature, ref: MapBoX) => {
    const properties = feature.properties as IFeature;

    if (properties.type === PropertyTypeEnum.primary) {
    } else {
      setOpenParcelData(properties);
    }

    if (popupRef.current) {
      new Popup({ closeButton: false, className: "[&>div:last-child]:rounded-xl [&>div:last-child]:shadow-4 [&>div:last-child]:p-3" })
        .setLngLat([properties.lng, properties.lat])
        .setDOMContent(popupRef.current)
        .addTo(ref)
        .on("close", () => {
          setOpenParcelData(null);
        });
    }
  }, []);

  const { ref, setRef, initiateMap, addRegridLayer, setGeoJson, loaded } = useMap({
    setMapInteraction: setMpaInteraction,
    mapInteraction,
    onMarkerClick,
  });

  const onLoad = useCallback(async () => {
    if (loaded) {
      const { owner, lat, lon, parcelNumberNoFormatting, propertiesUsedForCalculation, acreage } = data;
      const properties: IFeature[] = [];

      propertiesUsedForCalculation.forEach((property) => {
        if (property.isBulked) {
          property.data.properties.forEach((childProperty) => {
            properties.push({
              acreage: property.data.acreage,
              lat: childProperty.lat,
              lng: childProperty.lon,
              parcelNumberNoFormatting: childProperty.parcelNumberNoFormatting,
              type: childProperty.isMedianValid ? PropertyTypeEnum.secondary : PropertyTypeEnum.tertiary,
              bulkId: property.data.parcelNumberNoFormatting,
              icon: childProperty.isMedianValid ? "secondary" : "tertiary",
              iconSelected: childProperty.isMedianValid ? "secondaryHighlighted" : "tertiaryHighlighted",
              lastSaleDate: childProperty.lastSaleDate,
              lastSalePrice: childProperty.lastSalePrice,
              pricePerAcreage: childProperty.pricePerAcreage,
            });
          });
        } else {
          properties.push({
            acreage: property.data.acreage,
            lat: property.data.lat,
            lng: property.data.lon,
            parcelNumberNoFormatting: property.data.parcelNumberNoFormatting,
            type: property.data.isMedianValid ? PropertyTypeEnum.secondary : PropertyTypeEnum.tertiary,
            icon: property.data.isMedianValid ? "secondary" : "tertiary",
            iconSelected: property.data.isMedianValid ? "secondaryHighlighted" : "tertiaryHighlighted",
            lastSaleDate: property.data.lastSaleDate,
            lastSalePrice: property.data.lastSalePrice,
            pricePerAcreage: property.data.pricePerAcreage,
          });
        }
      });
      setGeoJson({
        owner,
        lat,
        lng: lon,
        parcelNumberNoFormatting,
        acreage,
        properties,
      });
      // await addRegridLayer();

      ref?.setCenter([data.lon, data.lat]);
      ref?.setZoom(8);
    }
  }, [data, ref, setGeoJson, loaded]);

  useEffect(() => {
    onLoad();
  }, [onLoad]);

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
      <div style={{ display: "none" }}>
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
        </div>
        <MapComponent ref={ref} setRef={setRef} />
      </div>
    </>
  );
};

export default SearchItemDetailsDesktopMap;
