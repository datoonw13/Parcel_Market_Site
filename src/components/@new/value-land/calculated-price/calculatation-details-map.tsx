"use client";

import { valueLandAtom } from "@/atoms/value-land-atom";
import { numFormatter } from "@/helpers/common";
import { ISignInResponse } from "@/types/auth";
import { useAtom } from "jotai";
import { LatLngTuple, Marker } from "leaflet";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import routes from "@/helpers/routes";
import ResponsiveWarningModal from "../../shared/modals/ResponsiveWarningModal";
import { InfoIcon2 } from "../../icons/InfoIcons";

const Map = dynamic(() => import("@/components/shared/map/Map"), { ssr: false });

const CalculationDetailsMap = ({ user }: { user: ISignInResponse["payload"] | null }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [valueLandData, setValueLandData] = useAtom(valueLandAtom);
  const markerRefs = useRef<{ [key: string]: Marker }>();
  const [openWarningModal, setOpenWarningModal] = useState(false);

  useEffect(() => {
    if (valueLandData.mapInteraction.hoveredLand && markerRefs.current) {
      markerRefs.current[valueLandData.mapInteraction.hoveredLand].openPopup();
    } else if (markerRefs.current) {
      Object.keys(markerRefs.current).forEach((key) => {
        markerRefs.current?.[key as keyof typeof markerRefs.current].closePopup();
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
          setMarkerRef={(key, ref) => {
            markerRefs.current = { ...markerRefs.current, [key]: ref };
          }}
          geolibInputCoordinates={[
            [Number(valueLandData.selectedLand.properties.fields.lat), Number(valueLandData.selectedLand.properties.fields.lon)],
          ]}
          zoom={10}
          onMarkerClick={() => (!user || !user.isSubscribed) && setOpenWarningModal(true)}
          markerMouseEnter={(value) => {
            setValueLandData((prev) => ({ ...prev, mapInteraction: { hoveredLand: JSON.stringify(value) } }));
          }}
          markerMouseLeave={() => {
            setValueLandData((prev) => ({ ...prev, mapInteraction: { hoveredLand: null } }));
          }}
          data={[
            {
              centerCoordinate: [
                Number(valueLandData.selectedLand.properties.fields.lat),
                Number(valueLandData.selectedLand.properties.fields.lon),
              ],
              active: true,
              parcelNumber: valueLandData.selectedLand.properties.fields.parcelnumb,
              polygon: valueLandData.selectedLand.geometry.coordinates,
              showMarker: true,
              popup: {
                owner: {
                  label: "Owner",
                  value: valueLandData.selectedLand.properties.fields.owner,
                },
                parcelNumber: {
                  label: "Parcel Number",
                  value: valueLandData.selectedLand.properties.fields.parcelnumb,
                },
                acreage: {
                  label: "Acreage",
                  value: valueLandData.selectedLand.properties.fields.ll_gisacre.toFixed(2),
                },
                showSelectButton: false,
              },
            },
            ...valueLandData.calculatedPrice.properties.map((el) => ({
              centerCoordinate: [Number(el.latitude), Number(el.longitude)] as LatLngTuple,
              parcelNumber: el.parselId,
              active: valueLandData.mapInteraction.hoveredLand === JSON.stringify([Number(el.latitude), Number(el.longitude)]),
              showMarker: true,
              ...(user &&
                user.isSubscribed && {
                  popup: {
                    parcelNumber: {
                      label: "Parcel Number",
                      value: el.parselId,
                    },
                    acreage: {
                      label: "Acreage",
                      value: el.arcage.toFixed(2),
                    },
                    lastSaleDate: {
                      label: "Last Sale Date",
                      value: el.lastSalesDate,
                    },
                    lastSalePrice: {
                      label: "Last Sale Price",
                      value: numFormatter.format(el.lastSalesPrice),
                    },
                    showSelectButton: false,
                  },
                }),
            })),
          ]}
        />
      </>
    )
  );
};

export default CalculationDetailsMap;
