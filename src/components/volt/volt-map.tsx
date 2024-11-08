"use client";

import { IVoltPriceCalculation, VoltSteps, VoltWrapperValuesModel } from "@/types/volt";
import { Map as LeafletMap, Marker } from "leaflet";
import dynamic from "next/dynamic";
import { Dispatch, FC, ReactElement, SetStateAction, useCallback, useEffect, useMemo, useRef } from "react";
import { moneyFormatter } from "@/helpers/common";
import { IDecodedAccessToken } from "@/types/auth";
import { MapInteractionModel } from "@/types/common";
import { IPropertyBaseInfo, IPropertyUsedForCalculation } from "@/types/property";
import moment from "moment";
import { getCenter } from "geolib";
import { Button } from "../ui/button";

const Map = dynamic(() => import("@/components/shared/map/Map"), { ssr: false });

interface VoltDesktopProps {
  step: VoltSteps;
  setValues: Dispatch<SetStateAction<VoltWrapperValuesModel>>;
  values: VoltWrapperValuesModel;
  user: IDecodedAccessToken | null;
  setOpenPropertyDetailWarningModal: Dispatch<SetStateAction<boolean>>;
  mapInteraction: MapInteractionModel;
  setMpaInteraction: Dispatch<SetStateAction<MapInteractionModel>>;
}

const VoltMap: FC<VoltDesktopProps> = ({
  step,
  setValues,
  values,
  user,
  setOpenPropertyDetailWarningModal,
  mapInteraction,
  setMpaInteraction,
}) => {
  const markerRefs = useRef<{ [key: string]: Marker }>();
  const mapRef = useRef<LeafletMap | null>(null);

  const mapData = useMemo(() => {
    if (step === VoltSteps.SEARCH) {
      return [{ parcelNumber: "test", latitude: 39.8283459, longitude: -98.5794797, center: true, markerType: "none" as const }];
    }
    if (step === VoltSteps.SEARCH_RESULTS && values.searchResult) {
      const getIcon = (el: IPropertyBaseInfo) => {
        if (values.selectedItem?.parcelNumberNoFormatting === el.parcelNumberNoFormatting) {
          return "active" as const;
        }
        if (
          mapInteraction.hoveredParcelNumber === el.parcelNumberNoFormatting ||
          mapInteraction.openPopperParcelNumber === el.parcelNumberNoFormatting
        ) {
          return "highlighted" as const;
        }
        return "default" as const;
      };
      return values.searchResult?.map((el) => ({
        parcelNumber: el.parcelNumberNoFormatting || "",
        latitude: el.lat,
        longitude: el.lon,
        polygon: el.polygon,
        markerType: getIcon(el),
        popup: (
          <div className="flex flex-col gap-1 space-y-2">
            <p className="!p-0 !m-0">
              Owner: <b>{el.owner}</b>
            </p>
            <p className="!p-0 !m-0">
              Parcel Number: <b>{el.parcelNumberNoFormatting}</b>
            </p>
            <p className="!p-0 !m-0">
              Acreage: <b>{el.acreage.toFixed(2)}</b>
            </p>
            {values.searchResult && values.searchResult?.length > 1 && (
              <Button
                className="py-1 h-auto !px-6 ml-auto flex mt-4"
                onClick={() => {
                  setValues((prev) => ({
                    ...prev,
                    selectedItem: prev.selectedItem?.parcelNumberNoFormatting === el.parcelNumberNoFormatting ? null : el,
                  }));
                }}
              >
                {values.selectedItem?.parcelNumberNoFormatting === el.parcelNumberNoFormatting ? "Remove" : "Select"}
              </Button>
            )}
          </div>
        ),
      }));
    }
    if (step === VoltSteps.CALCULATION && values.calculation) {
      const mainLandSaleHistory: IPropertyUsedForCalculation["data"][] = [];
      values.calculation.propertiesUsedForCalculation.forEach((property) => {
        if (property.isBulked) {
          property.data.properties.forEach((el) => {
            if (el.parcelNumberNoFormatting === values.selectedItem?.parcelNumberNoFormatting) {
              mainLandSaleHistory.push(el);
            }
          });
        } else if (property.data.parcelNumberNoFormatting === values.selectedItem?.parcelNumberNoFormatting) {
          mainLandSaleHistory.push(property.data);
        }
      });

      const mainProperty = {
        parcelNumber: values.selectedItem?.parcelNumber || "",
        parcelNumberNoFormatting: values.selectedItem?.parcelNumberNoFormatting || "",
        latitude: Number(values.calculation.lat),
        longitude: Number(values.calculation.lon),
        polygon: values.calculation.polygon,
        markerType: "active" as const,
        center: true,
        popup: (
          <div className="flex flex-col gap-1 space-y-2">
            <p className="!p-0 !m-0">
              Owner: <b>{values.calculation.owner}</b>
            </p>
            <p className="!p-0 !m-0">
              Acreage: <b>{Number(values.calculation.acreage).toFixed(2)}</b>
            </p>
            <p className="!p-0 !m-0">
              VOLT Value Per Acreage: <b>{moneyFormatter.format(values.calculation.pricePerAcreage)}</b>
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
                      Sold Price Per Acre: <b>{moneyFormatter.format(history.pricePerAcreage)}</b>
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

      values.calculation.propertiesUsedForCalculation.forEach((property) => {
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
                        Sold Price Per Acre: <b>{moneyFormatter.format(el.pricePerAcreage)}</b>
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
                      Sold Price Per Acre: <b>{moneyFormatter.format(property.data.pricePerAcreage)}</b>
                    </p>
                  </div>
                ),
              }),
          });
        }
      });

      values.calculation.propertiesUsedForCalculation
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
                      Sold Price Per Acre: <b>{moneyFormatter.format(item.data.pricePerAcreage)}</b>
                    </p>
                  </div>
                ),
              }),
          });
        });

      if (mainLandSaleHistory.length > 0) {
        mapItems = mapItems.filter((el) => !mainLandSaleHistory.find((x) => el.parcelNumberNoFormatting === x.parcelNumberNoFormatting));
      }
      return [mainProperty, ...mapItems];
    }
    return [];
  }, [
    mapInteraction.hoveredParcelNumber,
    mapInteraction.openPopperParcelNumber,
    setValues,
    step,
    user,
    values.calculation,
    values.searchResult,
    values.selectedItem?.parcelNumber,
    values.selectedItem?.parcelNumberNoFormatting,
  ]);

  const canViewDetails = (parcelNumberNoFormatting: string) => {
    if (
      (user && user.isSubscribed) ||
      step !== VoltSteps.CALCULATION ||
      parcelNumberNoFormatting === values.selectedItem?.parcelNumberNoFormatting
    ) {
      return true;
    }
    return false;
  };

  const handleMapHoverInteraction = useCallback(() => {
    if (mapRef.current && mapInteraction.hoveredParcelNumber) {
      if (mapInteraction.hoveredParcelNumber.includes("multiple")) {
        const properties = values.calculation?.propertiesUsedForCalculation
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
  }, [mapInteraction.hoveredParcelNumber, mapInteraction.zoom, values.calculation?.propertiesUsedForCalculation]);

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
        const properties = values.calculation?.propertiesUsedForCalculation
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
  }, [mapInteraction.openPopperParcelNumber, mapInteraction.zoom, values.calculation?.propertiesUsedForCalculation]);

  useEffect(() => {
    handleMapHoverInteraction();
  }, [handleMapHoverInteraction, mapInteraction.hoveredParcelNumber, mapInteraction.zoom]);

  useEffect(() => {
    handleMapPopperInteraction();
  }, [handleMapPopperInteraction, mapInteraction.openPopperParcelNumber, mapInteraction.zoom]);

  return (
    <Map
      properties={mapData}
      zoom={step === VoltSteps.SEARCH ? 5 : 8}
      dragging={step !== VoltSteps.SEARCH}
      disableZoom={step === VoltSteps.SEARCH}
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
          setOpenPropertyDetailWarningModal(true);
        }
      }}
      setMapRef={(ref) => {
        mapRef.current = ref;
      }}
    />
  );
};

export default VoltMap;
