"use client";

import dynamic from "next/dynamic";
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { IUserRecentSearches } from "@/types/user";
import { IDecodedAccessToken } from "@/types/auth";
import { MapInteractionModel } from "@/types/common";
import useMap, { IFeature, PropertyTypeEnum } from "@/hooks/useMap";
import { GeoJSONFeature, Popup, Map as MapBoX } from "mapbox-gl";
import { swapPolygonCoordinates } from "@/lib/utils";
import moment from "moment";
import { moneyFormatter } from "@/helpers/common";

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
        .addTo(ref);
    }
  }, []);

  const { ref, setRef, initiateMap } = useMap({ setMapInteraction: setMpaInteraction, mapInteraction, onMarkerClick });

  useEffect(() => {
    const { owner, polygon, lat, lon, parcelNumberNoFormatting, propertiesUsedForCalculation, acreage } = data;
    initiateMap({
      owner,
      coordinates: swapPolygonCoordinates(polygon as any),
      lat,
      lng: lon,
      parcelNumberNoFormatting,
      acreage,
      properties: [...propertiesUsedForCalculation, ...(additionalDataResult?.propertiesUsedForCalculation || [])],
    });

    ref?.setCenter([data.lon, data.lat]);
    ref?.setZoom(8);
  }, [additionalDataResult?.propertiesUsedForCalculation, data, initiateMap, ref]);

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
                    Parcel Number: <span className="text-black font-semibold">{openParcelData?.parcelNumber}</span>
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
      <MapComponent ref={ref} setRef={setRef} />
    </>
  );
};

export default SearchItemDetailsDesktopMap;
