"use client";

import { valueLandAtom } from "@/atoms/value-land-atom";
import { numFormatter } from "@/helpers/common";
import routes from "@/helpers/routes";
import FbIcon from "@/icons/FbIcon";
import TwitterIcon from "@/icons/TwitterIcon";
import { useAtom } from "jotai";
import { LatLngTuple } from "leaflet";
import dynamic from "next/dynamic";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Map = dynamic(() => import("@/components/shared/map/Map"), { ssr: false });

function formatCompactNumber(number: number) {
  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  return formatter.format(number);
}

const ValueLanSidebar = () => {
  const pathname = usePathname();
  const [valueLand, setValueLand] = useAtom(valueLandAtom);

  return (
    <div className="hidden xl:block relative">
      <div className="sticky top-0 w-full h-screen">
        <div className="relative w-full h-full">
          {pathname === routes.valueLand.value.fullUrl ? (
            valueLand.selectedLand &&
            valueLand.calculatedPrice && (
              <Map
                geolibInputCoordinates={[
                  [Number(valueLand.selectedLand.properties.fields.lat), Number(valueLand.selectedLand.properties.fields.lon)],
                ]}
                zoom={10}
                data={[
                  {
                    centerCoordinate: [
                      Number(valueLand.selectedLand.properties.fields.lat),
                      Number(valueLand.selectedLand.properties.fields.lon),
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
                        {formatCompactNumber(valueLand.calculatedPrice.price)}
                      </div>
                    ),
                    parcelNumber: valueLand.selectedLand.properties.fields.parcelnumb,
                    polygon: valueLand.selectedLand.geometry.coordinates,
                    showMarker: true,
                    popup: {
                      parcelNumber: {
                        label: "Parcel Number",
                        value: valueLand.selectedLand.properties.fields.parcelnumb,
                      },
                      acreage: {
                        label: "Acreage",
                        value: valueLand.selectedLand.properties.fields.ll_gisacre.toFixed(2),
                      },
                      showSelectButton: false,
                    },
                  },
                  ...valueLand.calculatedPrice.properties.map((el) => ({
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
            )
          ) : (
            <>
              <Image alt="" src="/parcel-find-cover.png" fill style={{ objectFit: "cover" }} />
              <div className="absolute w-full h-full bg-black-400" />
              <div className="flex flex-row items-center justify-end gap-4 absolute w-full bottom-0 z-20 text-white font-medium p-6">
                <div>Let&apos;s connect</div>
                <div className="cursor-pointer [&>svg>circle]:fill-grey-30 [&>svg>circle]:stroke-white [&>svg>path]:fill-white">
                  <FbIcon />
                </div>
                <div className="cursor-pointer [&>svg>circle]:fill-grey-30 [&>svg>circle]:stroke-white [&>svg>path]:fill-white">
                  <TwitterIcon />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValueLanSidebar;
