"use client";

import { Map as LeafletMap, Marker } from "leaflet";
import dynamic from "next/dynamic";
import { Dispatch, FC, ReactElement, SetStateAction, useCallback, useEffect, useRef } from "react";
import { moneyFormatter } from "@/helpers/common";
import { IDecodedAccessToken } from "@/types/auth";
import { MapInteractionModel } from "@/types/common";
import moment from "moment";
import { IUserRecentSearches } from "@/types/user";
import { IPropertyUsedForCalculation } from "@/types/property";
import { getCenter } from "geolib";

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

  const mainLandSaleHistory: IPropertyUsedForCalculation["data"][] = [];
  data.propertiesUsedForCalculation.forEach((property) => {
    if (property.isBulked) {
      property.data.properties.forEach((el) => {
        if (el.parcelNumberNoFormatting === data.parcelNumberNoFormatting) {
          mainLandSaleHistory.push(el);
        }
      });
    } else if (property.data.parcelNumberNoFormatting === data.parcelNumberNoFormatting) {
      mainLandSaleHistory.push(property.data);
    }
  });

  const mainProperty = {
    parcelNumber: data?.parcelNumber || "",
    parcelNumberNoFormatting: data?.parcelNumberNoFormatting || "",
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
          Acreage: <b>{Number(data.acreage).toFixed(2)}</b>
        </p>
        <p className="!p-0 !m-0">
          VOLT Value Per Acre: <b>{moneyFormatter.format(data.pricePerAcreage)}</b>
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
                  Last Sale Price Per Acreage: <b>{moneyFormatter.format(history.pricePerAcreage)}</b>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    ),
  };

  const isActive = (parcelNumber: string) => {
    if (mapInteraction.hoveredParcelNumber?.includes("multiple") || mapInteraction.openPopperParcelNumber?.includes("multiple")) {
      return (
        mapInteraction.hoveredParcelNumber?.split("multiple")?.includes(parcelNumber) ||
        mapInteraction.openPopperParcelNumber?.split("multiple").includes(parcelNumber)
      );
    }
    return mapInteraction.hoveredParcelNumber === parcelNumber || mapInteraction.openPopperParcelNumber === parcelNumber;
  };

  let mapItems: Array<{
    parcelNumber: string;
    parcelNumberNoFormatting: string;
    latitude: number;
    longitude: number;
    markerType: "highlighted" | "default";
    popup?: ReactElement;
  }> = [];

  data.propertiesUsedForCalculation.forEach((property) => {
    if (property.isBulked) {
      property.data.properties.forEach((el) => {
        mapItems.push({
          parcelNumber: el.parcelNumberNoFormatting,
          parcelNumberNoFormatting: el.parcelNumberNoFormatting,
          latitude: el.lat,
          longitude: el.lon,
          markerType: isActive(el.parcelNumberNoFormatting) ? ("highlighted" as const) : ("default" as const),
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
                    Last Sale Price Per Acreage: <b>{moneyFormatter.format(el.pricePerAcreage)}</b>
                  </p>
                </div>
              ),
            }),
        });
      });
    } else {
      mapItems.push({
        parcelNumber: property.data.parcelNumberNoFormatting,
        parcelNumberNoFormatting: property.data.parcelNumberNoFormatting,
        latitude: property.data.lat,
        longitude: property.data.lon,
        markerType: isActive(property.data.parcelNumberNoFormatting) ? ("highlighted" as const) : ("default" as const),
        ...(user &&
          user.isSubscribed && {
            popup: (
              <div className="flex flex-col gap-1 space-y-2">
                <p className="!p-0 !m-0">
                  Parcel Number: <b>{property.data.parcelNumberNoFormatting}</b>
                </p>
                <p className="!p-0 !m-0">
                  Acreage: <b>{property.data.acreage.toFixed(2)}</b>
                </p>
                <p className="!p-0 !m-0">
                  Last Sale Date: <b>{moment(property.data.lastSaleDate).format("MM-DD-YYYY")}</b>
                </p>
                <p className="!p-0 !m-0">
                  Last Sale Price Per Acreage: <b>{moneyFormatter.format(property.data.pricePerAcreage)}</b>
                </p>
              </div>
            ),
          }),
      });
    }
  });

  data.propertiesUsedForCalculation
    .filter((el) => el.isBulked)
    .forEach((item) => {
      mapItems.push({
        parcelNumber: item.data.parcelNumber,
        parcelNumberNoFormatting: item.data.parcelNumberNoFormatting,
        latitude: item.data.properties[0].lat,
        longitude: item.data.properties[0].lon,
        markerType: "invisible" as any,
        ...(user &&
          user.isSubscribed && {
            popup: (
              <div className="flex flex-col gap-1 space-y-2">
                <h2 className="!font-semibold !mb-3 text-center">Bulk item</h2>
                <p className="!p-0 !m-0">
                  Acreage: <b>{item.data.acreage.toFixed(2)}</b>
                </p>
                <p className="!p-0 !m-0">
                  Last Sale Date: <b>{moment(item.data.properties[0].lastSaleDate).format("MM-DD-YYYY")}</b>
                </p>
                <p className="!p-0 !m-0">
                  Last Sale Price Per Acreage: <b>{moneyFormatter.format(item.data.pricePerAcreage)}</b>
                </p>
              </div>
            ),
          }),
      });
    });

  if (mainLandSaleHistory.length > 0) {
    mapItems = mapItems.filter((el) => !mainLandSaleHistory.find((x) => el.parcelNumberNoFormatting === x.parcelNumberNoFormatting));
  }

  const canViewDetails = (parcelNumberNoFormatting: string) => {
    if ((user && user.isSubscribed) || parcelNumberNoFormatting === data.parcelNumberNoFormatting) {
      return true;
    }
    return false;
  };

  const handleMapHoverInteraction = useCallback(() => {
    if (mapRef.current && mapInteraction.hoveredParcelNumber) {
      if (mapInteraction.hoveredParcelNumber.includes("multiple")) {
        const properties = data?.propertiesUsedForCalculation
          .filter((el) => el.isBulked)
          .map((el) => el.data.properties)
          .flat();

        const items: IPropertyUsedForCalculation["data"][] = [];
        mapInteraction.hoveredParcelNumber.split("multiple").forEach((el) => {
          const item = properties?.find((x) => x.parcelNumberNoFormatting === el);
          if (item) {
            items.push(item);
          }
        });
        const centerCoordinate = (getCenter(items.map((el) => ({ latitude: el.lat, longitude: el.lon }))) || {
          latitude: 0,
          longitude: 0,
        }) as any;
        if (mapInteraction.zoom) {
          mapRef.current?.fitBounds(
            [
              {
                lat: centerCoordinate.latitude,
                lng: centerCoordinate.longitude,
              },
            ] as any,
            { maxZoom: 14 }
          );
        }
      } else {
        const currentItemMarker = markerRefs.current?.[mapInteraction.hoveredParcelNumber];
        if (currentItemMarker) {
          const currentMarkerCoordinate = [currentItemMarker.getLatLng()] as any;
          if (mapInteraction.zoom) {
            mapRef.current?.fitBounds(currentMarkerCoordinate, { maxZoom: 14 });
          }
        }
      }
    }
  }, [data?.propertiesUsedForCalculation, mapInteraction.hoveredParcelNumber, mapInteraction.zoom]);

  const handleMapPopperInteraction = useCallback(() => {
    if (mapRef.current) {
      if (mapInteraction.openPopperParcelNumber && !mapInteraction.openPopperParcelNumber.includes("multiple")) {
        const currentItemMarker = markerRefs.current?.[mapInteraction.openPopperParcelNumber];
        if (currentItemMarker) {
          currentItemMarker.openPopup();
          const currentMarkerCoordinate = [currentItemMarker.getLatLng()] as any;
          if (mapInteraction.zoom) {
            mapRef.current?.fitBounds(currentMarkerCoordinate, { maxZoom: 14 });
          }
        }
      }

      if (mapInteraction.openPopperParcelNumber && mapInteraction.openPopperParcelNumber.includes("multiple")) {
        const properties = data?.propertiesUsedForCalculation
          .filter((el) => el.isBulked)
          .map((el) => el.data.properties)
          .flat();
        const items: IPropertyUsedForCalculation["data"][] = [];
        mapInteraction.openPopperParcelNumber.split("multiple").forEach((el) => {
          const item = properties?.find((x) => x.parcelNumberNoFormatting === el);
          if (item) {
            items.push(item);
          }
        });
        const centerCoordinate = (getCenter(items.map((el) => ({ latitude: el.lat, longitude: el.lon }))) || {
          latitude: 0,
          longitude: 0,
        }) as any;
        mapRef.current.closePopup();
        if (mapInteraction.zoom) {
          mapRef.current?.fitBounds(
            [
              {
                lat: centerCoordinate.latitude,
                lng: centerCoordinate.longitude,
              },
            ] as any,
            { maxZoom: 14 }
          );
        }

        /// open popup
        const currentItemMarker = markerRefs.current?.[mapInteraction.openPopperParcelNumber];
        if (currentItemMarker) {
          currentItemMarker.openPopup();
          const currentMarkerCoordinate = [currentItemMarker.getLatLng()] as any;
          if (mapInteraction.zoom) {
            mapRef.current?.fitBounds(currentMarkerCoordinate, { maxZoom: 14 });
          }
        }
      }
    }
  }, [data?.propertiesUsedForCalculation, mapInteraction.openPopperParcelNumber, mapInteraction.zoom]);

  useEffect(() => {
    handleMapHoverInteraction();
  }, [handleMapHoverInteraction, mapInteraction.hoveredParcelNumber, mapInteraction.zoom]);

  useEffect(() => {
    handleMapPopperInteraction();
  }, [handleMapPopperInteraction, mapInteraction.openPopperParcelNumber, mapInteraction.zoom]);

  return (
    <Map
      properties={[mainProperty, ...mapItems]}
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
