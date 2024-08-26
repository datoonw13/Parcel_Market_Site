"use client";

import { valueLandAtom } from "@/atoms/value-land-atom";
import { formatParcelNumber, numFormatter } from "@/helpers/common";
import { IDecodedAccessToken } from "@/types/auth";
import { useAtom } from "jotai";
import { LatLngTuple, Marker } from "leaflet";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import routes from "@/helpers/routes";
import { uuid } from "short-uuid";
import ResponsiveWarningModal from "../../shared/modals/ResponsiveWarningModal";
import { InfoIcon2 } from "../../icons/InfoIcons";

const Map = dynamic(() => import("@/components/shared/map/Map"), { ssr: false });

const CalculationDetailsMap = ({ user }: { user: IDecodedAccessToken | null }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [valueLandData, setValueLandData] = useAtom(valueLandAtom);
  const markerRefs = useRef<{ [key: string]: Marker }>();
  const [openWarningModal, setOpenWarningModal] = useState(false);

  const mainLandSaleHistory = valueLandData.calculatedPrice?.properties.filter(
    (property) =>
      formatParcelNumber(property?.parselId || "") ===
      formatParcelNumber(valueLandData.selectedLand?.properties.fields.parcelnumb_no_formatting || "")
  );

  const mapItems = [
    {
      parcelNumber: valueLandData.selectedLand?.properties.fields.parcelnumb_no_formatting || "",
      latitude: Number(valueLandData.selectedLand?.properties.fields.lat),
      longitude: Number(valueLandData.selectedLand?.properties.fields.lon),
      polygon: valueLandData.selectedLand?.geometry.coordinates,
      markerType: "active" as const,
      center: true,
      popup: (
        <div className="flex flex-col gap-1 space-y-2">
          <p className="!p-0 !m-0">
            Owner: <b>{valueLandData.selectedLand?.properties.fields.owner}</b>
          </p>
          <p className="!p-0 !m-0">
            Acreage: <b>{valueLandData.selectedLand?.properties.fields.ll_gisacre}</b>
          </p>
          <p className="!p-0 !m-0">
            Price Per Acreage:{" "}
            <b>
              {valueLandData.calculatedPrice &&
                numFormatter.format(valueLandData.calculatedPrice.price / Number(valueLandData.selectedLand?.properties.fields.ll_gisacre))}
            </b>
          </p>
          {mainLandSaleHistory && mainLandSaleHistory?.length > 0 && (
            <div className="flex flex-col gap-1">
              <p className="!p-0 !m-0 !font-semibold">Sales History:</p>
              {mainLandSaleHistory.map((history) => (
                <div key={JSON.stringify(history)} className="!mb-1">
                  <p className="!p-0 !m-0">
                    Last Sale Date: <b>{history.lastSalesDate}</b>
                  </p>
                  <p className="!p-0 !m-0">
                    Last Sale Price Per Acre: <b>{numFormatter.format(Number(history.lastSalesPrice) / Number(history.arcage))}</b>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    ...(valueLandData.calculatedPrice?.properties || [])
      .filter((property) =>
        mainLandSaleHistory && mainLandSaleHistory.length > 0
          ? mainLandSaleHistory.find(
              (saleHistory) => formatParcelNumber(saleHistory?.parselId || "") !== formatParcelNumber(property.parselId)
            )
          : true
      )
      .map((el) => ({
        ...el,
        id: formatParcelNumber(el?.parselId || uuid()),
        latitude: Number(el.latitude),
        longitude: Number(el.longitude),
        parcelNumber: formatParcelNumber(el?.parselId || uuid()),
        ...(user &&
          user.isSubscribed && {
            popup: (
              <div className="flex flex-col gap-1">
                <p className="!p-0 !m-0">
                  Parcel Number: <b>{el.parcelNumber}</b>
                </p>
                <p className="!p-0 !m-0">
                  Acreage: <b>{el.arcage}</b>
                </p>
                <p className="!p-0 !m-0">
                  Last Sale Date: <b>{el.lastSalesDate}</b>
                </p>
                <p className="!p-0 !m-0">
                  Last Sale Price Per Acre: <b>{numFormatter.format(Number(el.lastSalesPrice) / Number(el.arcage))}</b>
                </p>
              </div>
            ),
          }),
      })),
  ];

  useEffect(() => {
    if (valueLandData.mapInteraction.hoveredLand && markerRefs.current) {
      markerRefs.current?.[valueLandData.mapInteraction.hoveredLand]?.openPopup();
    } else if (markerRefs.current) {
      Object.keys(markerRefs.current).forEach((key) => {
        markerRefs.current?.[key as keyof typeof markerRefs.current]?.closePopup();
      });
    }
  }, [valueLandData.mapInteraction.hoveredLand]);

  useEffect(
    () => () => {
      setValueLandData((prev) => ({ ...prev, mapInteraction: { hoveredLand: null } }));
    },
    [setValueLandData]
  );

  return (
    valueLandData.selectedLand &&
    valueLandData.calculatedPrice && (
      <>
        <ResponsiveWarningModal
          customIcon={<InfoIcon2 className="!w-4 !h-4 min-w-4 min-h-4" color="primary-main" />}
          open={openWarningModal}
          variant="success"
          closeModal={() => setOpenWarningModal(false)}
          onOK={() => {
            if (!user) {
              params.set("from", routes.valueLand.value.fullUrl);
              router.replace(`${routes.auth.signIn.fullUrl}?${params.toString()}`);
            } else {
              router.push(routes.user.subscription.fullUrl);
            }
          }}
          onCancel={() => setOpenWarningModal(false)}
          title={!user ? "Log in to See the information" : "Closed content"}
          description={
            !user
              ? "Your are not logged in, if you want to see this information please log into your account"
              : "Subscribe now to view, save, and export sales data."
          }
          okLabel={!user ? "Log In" : "Subscribe"}
          cancelLabel="Close"
        />
        <Map
          setMarkerRef={(parcelNumber, ref) => {
            markerRefs.current = { ...markerRefs.current, [parcelNumber]: ref };
          }}
          zoom={10}
          onMarkerClick={() => (!user || !user.isSubscribed) && setOpenWarningModal(true)}
          markerMouseEnter={(parcelNumber) => {
            setValueLandData((prev) => ({ ...prev, mapInteraction: { hoveredLand: parcelNumber } }));
          }}
          markerMouseLeave={() => {
            setValueLandData((prev) => ({ ...prev, mapInteraction: { hoveredLand: null } }));
          }}
          properties={mapItems}
        />
      </>
    )
  );
};

export default CalculationDetailsMap;
