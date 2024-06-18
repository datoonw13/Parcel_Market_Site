"use client";

import FbIcon from "@/icons/FbIcon";
import TwitterIcon from "@/icons/TwitterIcon";
import { Box, Typography, alpha } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import { IFindPropertyEstimatedPriceResponse } from "@/types/find-property";
import dynamic from "next/dynamic";
import { IMapItem } from "@/types/map";
import FindProperty from "@/components/find-property/FindProperty";
import { MiniFooter } from "@/components/footer";
import { AppBarMini } from "@/components/app-bar";
import useAuthCheck from "@/hooks/useAuthCheck";
import { LatLngTuple } from "leaflet";
import { numFormatter } from "@/helpers/common";

const FindPropertyCalculatePriceMap = dynamic(() => import("@/components/find-property/FindPropertyCalculatePriceMap"), {
  ssr: false,
});

const Map = dynamic(() => import("@/components/shared/Map"), { ssr: false });

function formatCompactNumber(number: number) {
  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  return formatter.format(number);
}

const FindPropertyLayout = () => {
  const [calculatedPrice, setCalculatedPrice] = useState<IFindPropertyEstimatedPriceResponse | null>(null);
  const [selectedRegridItem, setSelectedRegridItem] = useState<IMapItem | null>(null);
  useAuthCheck();
  return (
    <Box sx={{ height: "100vh", display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 400px", xl: "1fr 544px" } }}>
      <Box sx={{ px: { xs: 2.5, sm: 3.5, md: 5, lg: 6.5, xl: 8 }, display: "flex", flexDirection: "column" }}>
        <AppBarMini />
        <FindProperty
          calculatedPrice={calculatedPrice}
          setCalculatedPrice={setCalculatedPrice}
          selectedRegridItem={selectedRegridItem}
          setSelectedRegridItem={setSelectedRegridItem}
        />
        <MiniFooter />
      </Box>
      <Box sx={{ position: "relative", display: { xs: "none", lg: "block" } }}>
        <Box sx={{ position: "sticky", width: "100%", height: "100vh", top: 0 }}>
          <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
            <Image alt="" src="/parcel-find-cover.png" fill style={{ objectFit: "cover" }} />
            {calculatedPrice ? (
              selectedRegridItem &&
              calculatedPrice && (
                // <FindPropertyCalculatePriceMap
                //   price={calculatedPrice.price}
                //   mainParcel={selectedRegridItem}
                //   parcels={calculatedPrice.properties}
                // />
                <Map
                  geolibInputCoordinates={[
                    [Number(selectedRegridItem.properties.fields.lat), Number(selectedRegridItem.properties.fields.lon)],
                  ]}
                  zoom={10}
                  data={[
                    {
                      centerCoordinate: [
                        Number(selectedRegridItem.properties.fields.lat),
                        Number(selectedRegridItem.properties.fields.lon),
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
                          {formatCompactNumber(calculatedPrice.price)}
                        </div>
                      ),
                      parcelNumber: selectedRegridItem.properties.fields.parcelnumb,
                      polygon: selectedRegridItem.geometry.coordinates,
                      showMarker: true,
                      popup: {
                        parcelNumber: {
                          label: "Parcel Number",
                          value: selectedRegridItem.properties.fields.parcelnumb,
                        },
                        acreage: {
                          label: "Acreage",
                          value: selectedRegridItem.properties.fields.ll_gisacre.toFixed(2),
                        },
                        showSelectButton: false,
                      },
                    },
                    ...calculatedPrice.properties.map((el) => ({
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
                <Box
                  sx={(theme) => ({
                    bgcolor: alpha(theme.palette.black, 0.3),
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    zIndex: 1,
                  })}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "end",
                    gap: 2,
                    position: "absolute",
                    width: "100%",
                    bottom: 0,
                    zIndex: 2,
                    color: "white",
                    fontWeight: 500,
                    p: 3,
                  }}
                >
                  <Typography>Let&apos;s connect</Typography>
                  <Box
                    sx={(theme) => ({
                      cursor: "pointer",
                      "& > svg > circle": { fill: alpha(theme.palette.white, 0.1), fillOpacity: 1, stroke: "white" },
                      "& > svg > path": { fill: theme.palette.white, fillOpacity: 1 },
                    })}
                  >
                    <FbIcon />
                  </Box>
                  <Box
                    sx={(theme) => ({
                      cursor: "pointer",
                      "& > svg > circle": { fill: alpha(theme.palette.white, 0.1), fillOpacity: 1, stroke: "white" },
                      "& > svg > path": { fill: theme.palette.white, fillOpacity: 1 },
                    })}
                  >
                    <TwitterIcon />
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FindPropertyLayout;
