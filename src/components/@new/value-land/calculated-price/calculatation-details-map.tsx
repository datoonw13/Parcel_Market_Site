"use client";

import { valueLandAtom } from "@/atoms/value-land-atom";
import { numFormatter } from "@/helpers/common";
import { useAtomValue } from "jotai";
import { LatLngTuple } from "leaflet";
import dynamic from "next/dynamic";

function formatCompactNumber(number: number) {
  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  return formatter.format(number);
}

const Map = dynamic(() => import("@/components/shared/map/Map"), { ssr: false });

const CalculationDetailsMap = () => {
  const valueLandData = useAtomValue(valueLandAtom);

  return (
    valueLandData.selectedLand &&
    valueLandData.calculatedPrice && (
      <div className="h-72 sm:h-80 w-full xl:hidden [&>div]:rounded-2xl">
        <Map
          geolibInputCoordinates={[
            [Number(valueLandData.selectedLand.properties.fields.lat), Number(valueLandData.selectedLand.properties.fields.lon)],
          ]}
          zoom={10}
          data={[
            {
              centerCoordinate: [
                Number(valueLandData.selectedLand.properties.fields.lat),
                Number(valueLandData.selectedLand.properties.fields.lon),
              ],
              markerColor: "custom",
              customMarkerIcon: (
                <div
                  style={{
                    background: "#3EA266",
                    boxShadow: "0px 0px 20px 0px #00000026",
                    width: 80,
                    height: 35,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    color: "white",
                    borderRadius: 60,
                  }}
                >
                  {formatCompactNumber(valueLandData.calculatedPrice.price)}
                </div>
              ),
              parcelNumber: valueLandData.selectedLand.properties.fields.parcelnumb,
              polygon: valueLandData.selectedLand.geometry.coordinates,
              showMarker: true,
              popup: {
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
              showMarker: true,
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
            })),
          ]}
        />
      </div>
    )
  );
};

export default CalculationDetailsMap;
