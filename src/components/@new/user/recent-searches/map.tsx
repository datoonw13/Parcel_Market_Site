"use client";

import { Map as LeafletMap, Marker } from "leaflet";
import dynamic from "next/dynamic";
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useRef } from "react";
import { moneyFormatter } from "@/helpers/common";
import { IDecodedAccessToken } from "@/types/auth";
import { MapInteractionModel } from "@/types/common";
import moment from "moment";
import { IUserRecentSearches } from "@/types/user";

const Map = dynamic(() => import("@/components/shared/map/Map"), { ssr: false });

interface VoltDesktopProps {
  data: IUserRecentSearches;
  user: IDecodedAccessToken | null;
  openWarningModal: () => void;
  mapInteraction: MapInteractionModel;
  setMpaInteraction: Dispatch<SetStateAction<MapInteractionModel>>;
}

const RecentSearchesMap: FC<VoltDesktopProps> = ({ user, openWarningModal, mapInteraction, setMpaInteraction, data }) => {
  const markerRefs = useRef<{ [key: string]: Marker }>();
  const mapRef = useRef<LeafletMap | null>(null);

  const mainLandSaleHistory = data.propertiesUsedForCalculation.filter(
    (el) => el.parcelNumberNoFormatting === data.parcelNumberNoFormatting
  );
  const mainProperty = {
    parcelNumber: data.parcelNumberNoFormatting,
    parcelNumberNoFormatting: data.parcelNumberNoFormatting,
    latitude: data.lat,
    longitude: data.lon,
    polygon: data.polygon,
    markerType: "active" as const,
    center: true,
    popup: (
      <div className="flex flex-col gap-1 space-y-2">
        <p className="!p-0 !m-0">
          Owner: <b>{data.owner}</b>
        </p>
        <p className="!p-0 !m-0">
          Acreage: <b>{data.acreage.toFixed(2)}</b>
        </p>
        <p className="!p-0 !m-0">
          Price Per Acre: <b>{moneyFormatter.format(data.pricePerAcreage)}</b>
        </p>
        {mainLandSaleHistory.length > 0 && (
          <div className="flex flex-col gap-1">
            <p className="!p-0 !m-0 !font-semibold">Sales History:</p>
            {mainLandSaleHistory.map((history) => (
              <div key={JSON.stringify(history)} className="!mb-1">
                <p className="!p-0 !m-0">
                  Last Sale Date: <b>{moment(history.lastSaleDate).format("MM-DD-YYYY")}</b>
                </p>
                <p className="!p-0 !m-0">
                  Last Sale Price Per Acre: <b>{moneyFormatter.format(history.pricePerAcreage)}</b>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    ),
  };

  let properties = data.propertiesUsedForCalculation?.map((el) => ({
    parcelNumber: el.parcelNumberNoFormatting,
    parcelNumberNoFormatting: el.parcelNumberNoFormatting,
    latitude: el.lat,
    longitude: el.lon,
    markerType:
      mapInteraction.hoveredParcelNumber === el.parcelNumberNoFormatting ||
      mapInteraction.openPopperParcelNumber === el.parcelNumberNoFormatting
        ? ("highlighted" as const)
        : ("default" as const),
    ...(user &&
      user.isSubscribed && {
        popup: (
          <div className="flex flex-col gap-1 space-y-2">
            <p className="!p-0 !m-0">
              Parcel Number: <b>{el.parcelNumberNoFormatting}</b>
            </p>
            <p className="!p-0 !m-0">
              Acreage: <b>{el.acreage.toFixed(2)}</b>
            </p>
            <p className="!p-0 !m-0">
              Last Sale Date: <b>{moment(el.lastSaleDate).format("MM-DD-YYYY")}</b>
            </p>
            <p className="!p-0 !m-0">
              Last Sale Price Per Acre: <b>{moneyFormatter.format(el.pricePerAcreage)}</b>
            </p>
          </div>
        ),
      }),
  }));

  if (mainLandSaleHistory.length > 0) {
    properties = properties.filter((el) => !mainLandSaleHistory.find((x) => el.parcelNumberNoFormatting === x.parcelNumberNoFormatting));
  }

  const canViewDetails = (parcelNumberNoFormatting: string) => {
    if ((user && user.isSubscribed) || parcelNumberNoFormatting === data.parcelNumberNoFormatting) {
      return true;
    }
    return false;
  };

  const handleMapHoverInteraction = useCallback(() => {
    if (mapRef.current) {
      if (mapInteraction.hoveredParcelNumber) {
        const currentItemMarker = markerRefs.current?.[mapInteraction.hoveredParcelNumber];
        if (currentItemMarker) {
          const currentMarkerCoordinate = [currentItemMarker.getLatLng()] as any;
          if (mapInteraction.zoom) {
            mapRef.current.fitBounds(currentMarkerCoordinate, { maxZoom: 12 });
          }
        }
      }
    }
  }, [mapInteraction.hoveredParcelNumber, mapInteraction.zoom]);

  const handleMapPopperInteraction = useCallback(() => {
    if (mapRef.current) {
      if (mapInteraction.openPopperParcelNumber) {
        const currentItemMarker = markerRefs.current?.[mapInteraction.openPopperParcelNumber];
        if (currentItemMarker) {
          currentItemMarker.openPopup();
          const currentMarkerCoordinate = [currentItemMarker.getLatLng()] as any;
          if (mapInteraction.zoom) {
            mapRef.current.fitBounds(currentMarkerCoordinate, { maxZoom: 12 });
          }
        }
      }
    }
  }, [mapInteraction.openPopperParcelNumber, mapInteraction.zoom]);

  useEffect(() => {
    handleMapHoverInteraction();
  }, [handleMapHoverInteraction, mapInteraction.hoveredParcelNumber, mapInteraction.zoom]);

  useEffect(() => {
    handleMapPopperInteraction();
  }, [handleMapPopperInteraction, mapInteraction.openPopperParcelNumber, mapInteraction.zoom]);

  return (
    <Map
      properties={[mainProperty, ...properties]}
      zoom={8}
      dragging
      setMarkerRef={(parcelNumber, ref) => {
        markerRefs.current = { ...markerRefs.current, [parcelNumber]: ref };
      }}
      markerMouseEnter={(parcelNumberNoFormatting) => {
        setMpaInteraction((prevData) => ({
          ...prevData,
          hoveredParcelNumber: parcelNumberNoFormatting,
          zoom: false,
        }));
      }}
      markerMouseLeave={() => {
        setMpaInteraction((prevData) => ({
          ...prevData,
          hoveredParcelNumber: null,
          zoom: false,
        }));
      }}
      popupOpen={(parcelNumberNoFormatting) => {
        setMpaInteraction((prevData) => ({
          ...prevData,
          openPopperParcelNumber: parcelNumberNoFormatting,
          zoom: false,
        }));
      }}
      popupClose={() => {
        setMpaInteraction((prevData) => ({
          ...prevData,
          openPopperParcelNumber: null,
          zoom: false,
        }));
      }}
      onMarkerClick={(parcelNumberNoFormatting) => {
        if (!canViewDetails(parcelNumberNoFormatting)) {
          openWarningModal();
        }
      }}
      setMapRef={(ref) => {
        mapRef.current = ref;
      }}
    />
  );
};

export default RecentSearchesMap;
