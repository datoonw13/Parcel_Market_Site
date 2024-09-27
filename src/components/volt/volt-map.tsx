"use client";

import { VoltSteps, VoltWrapperValuesModel } from "@/types/volt";
import { Map as LeafletMap, Marker } from "leaflet";
import dynamic from "next/dynamic";
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useMemo, useRef } from "react";
import { moneyFormatter, removeParcelNumberFormatting } from "@/helpers/common";
import { IDecodedAccessToken } from "@/types/auth";
import { MapInteractionModel } from "@/types/common";
import { IMapItem } from "@/types/map";
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
      const getIcon = (el: IMapItem) => {
        if (values.selectedItem?.properties.fields.parcelnumb_no_formatting === el.properties.fields.parcelnumb_no_formatting) {
          return "active" as const;
        }
        if (
          mapInteraction.hoveredParcelNumber === el.properties.fields.parcelnumb_no_formatting ||
          mapInteraction.openPopperParcelNumber === el.properties.fields.parcelnumb_no_formatting
        ) {
          return "highlighted" as const;
        }
        return "default" as const;
      };
      return values.searchResult?.map((el) => ({
        parcelNumber: el.properties.fields.parcelnumb_no_formatting || "",
        latitude: Number(el.properties.fields.lat),
        longitude: Number(el.properties.fields.lon),
        polygon: el.geometry.coordinates,
        markerType: getIcon(el),
        popup: (
          <div className="flex flex-col gap-1 space-y-2">
            <p className="!p-0 !m-0">
              Owner: <b>{el.properties.fields.owner}</b>
            </p>
            <p className="!p-0 !m-0">
              Parcel Number: <b>{el.properties.fields.parcelnumb_no_formatting}</b>
            </p>
            <p className="!p-0 !m-0">
              Acreage: <b>{el.properties.fields.ll_gisacre.toFixed(2)}</b>
            </p>
            {values.searchResult && values.searchResult?.length > 1 && (
              <Button
                className="py-1 h-auto !px-6 ml-auto flex mt-4"
                onClick={() => {
                  setValues((prev) => ({
                    ...prev,
                    selectedItem:
                      prev.selectedItem?.properties.fields.parcelnumb_no_formatting === el.properties.fields.parcelnumb_no_formatting
                        ? null
                        : el,
                  }));
                }}
              >
                {values.selectedItem?.properties.fields.parcelnumb_no_formatting === el.properties.fields.parcelnumb_no_formatting
                  ? "Remove"
                  : "Select"}
              </Button>
            )}
          </div>
        ),
      }));
    }
    if (step === VoltSteps.CALCULATION && values.calculation) {
      const mainLandSaleHistory = values.calculation.properties.filter(
        (el) => removeParcelNumberFormatting(el.parselId) === removeParcelNumberFormatting(values.calculation?.parcelNumber || "")
      );

      const mainProperty = {
        parcelNumber: values.calculation.parcelNumber || "",
        latitude: Number(values.calculation.lat),
        longitude: Number(values.calculation.lon),
        polygon: JSON.parse(values.calculation.coordinates) as any,
        markerType: "active" as const,
        center: true,
        popup: (
          <div className="flex flex-col gap-1 space-y-2">
            <p className="!p-0 !m-0">
              Owner: <b>{values.calculation.owner}</b>
            </p>
            <p className="!p-0 !m-0">
              Acreage: <b>{Number(values.calculation.acrage).toFixed(2)}</b>
            </p>
            <p className="!p-0 !m-0">
              Price Per Acre: <b>{moneyFormatter.format(Number(values.calculation.price) / Number(values.calculation.acrage))}</b>
            </p>
            {mainLandSaleHistory.length > 0 && (
              <div className="flex flex-col gap-1">
                <p className="!p-0 !m-0 !font-semibold">Sales History:</p>
                {mainLandSaleHistory.map((history) => (
                  <div key={JSON.stringify(history)} className="!mb-1">
                    <p className="!p-0 !m-0">
                      Last Sale Date: <b>{history.lastSalesDate}</b>
                    </p>
                    <p className="!p-0 !m-0">
                      Last Sale Price Per Acre: <b>{moneyFormatter.format(Number(history.lastSalesPrice) / Number(history.arcage))}</b>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ),
      };
      let properties = values.calculation.properties?.map((el) => ({
        parcelNumber: el.parselId || "",
        latitude: Number(el.latitude),
        longitude: Number(el.longitude),
        markerType:
          mapInteraction.hoveredParcelNumber === removeParcelNumberFormatting(el.parselId) ||
          mapInteraction.openPopperParcelNumber === removeParcelNumberFormatting(el.parselId)
            ? ("highlighted" as const)
            : ("default" as const),
        ...(user &&
          user.isSubscribed && {
            popup: (
              <div className="flex flex-col gap-1 space-y-2">
                <p className="!p-0 !m-0">
                  Parcel Number: <b>{el.parselId}</b>
                </p>
                <p className="!p-0 !m-0">
                  Acreage: <b>{Number(el.arcage).toFixed(2)}</b>
                </p>
                <p className="!p-0 !m-0">
                  Last Sale Date: <b>{el.lastSalesDate}</b>
                </p>
                <p className="!p-0 !m-0">
                  Last Sale Price Per Acre: <b>{moneyFormatter.format(Number(el.lastSalesPrice) / Number(el.arcage))}</b>
                </p>
              </div>
            ),
          }),
      }));

      if (mainLandSaleHistory.length > 0) {
        properties = properties.filter(
          (el) =>
            !mainLandSaleHistory.find((x) => removeParcelNumberFormatting(el.parcelNumber) === removeParcelNumberFormatting(x.parselId))
        );
      }

      return [mainProperty, ...properties];
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
    values.selectedItem?.properties.fields.parcelnumb_no_formatting,
  ]);

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
        if (
          (!user || !user.isSubscribed) &&
          parcelNumberNoFormatting !== removeParcelNumberFormatting(values.selectedItem?.properties.fields.parcelnumb || "")
        ) {
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
