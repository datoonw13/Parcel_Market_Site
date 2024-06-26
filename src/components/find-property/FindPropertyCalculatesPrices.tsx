"use client";

import { numFormatter } from "@/helpers/common";
import routes from "@/helpers/routes";
import { setSelectedParcelOptions } from "@/lib/features/slices/authedUserSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { IFindPropertyEstimatedPriceResponse, ISellProperty } from "@/types/find-property";
import { IMapItem } from "@/types/map";
import { Box, Button, Divider, Slider, Typography, useMediaQuery, useTheme } from "@mui/material";
import { LatLngTuple } from "leaflet";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Map = dynamic(() => import("@/components/shared/Map"), { ssr: false });

const getFontSize = (val: string) => {
  if (val.length >= 10 && val.length <= 15) {
    return 28;
  }
  if (val.length >= 16 && val.length <= 20) {
    return 24;
  }
  if (val.length >= 21) {
    return 16;
  }
  return 48;
};

function formatCompactNumber(number: number) {
  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  return formatter.format(number);
}

const FindPropertyCalculatesPrices = ({
  data,
  selectedRegridItem,
  onNext,
}: {
  data: IFindPropertyEstimatedPriceResponse | null;
  selectedRegridItem: IMapItem | null;
  onNext: (sellerType: ISellProperty["sellerType"]) => void;
}) => {
  const theme = useTheme();
  const onlySmallScreen = useMediaQuery(theme.breakpoints.down(650));

  const onSell = (sellerType: ISellProperty["sellerType"]) => {
    onNext(sellerType);
  };
  return (
    <Box sx={{ display: "grid", gap: { xs: 3, md: 4 }, px: { xs: 2, md: 3, lg: 4, mb: 3 } }}>
      <Box sx={{ display: "grid", gridTemplateColumns: onlySmallScreen ? "1fr" : "1fr", gap: 2 }}>
        <Box
          sx={(theme) => ({
            border: `1px solid ${theme.palette.grey[100]}`,
            borderRadius: 4,
            px: { xs: 2, md: 3 },
            py: { xs: 3, md: 4 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            transition: "all 0.3s",
            "&:hover": {
              bgcolor: "green.100",
              border: `1px solid ${theme.palette.green[400]}`,
            },
          })}
        >
          <Typography sx={{ fontSize: 12, color: "grey.800", fontWeight: 500, mb: 1.5 }}>VOLT Value</Typography>
          <Typography sx={{ fontSize: getFontSize(numFormatter.format(data?.price || 0)), fontWeight: 600, mb: 4 }}>
            {" "}
            {data?.price && numFormatter.format(data.price)}
          </Typography>
          <Box sx={{ width: "100%", mb: 3 }}>
            <Slider
              value={50}
              min={0}
              max={100}
              color="warning"
              sx={(theme) => ({
                ".MuiSlider-thumb": {
                  bgcolor: "white",
                  position: "relative",
                  border: `2px solid ${theme.palette.warning.main}`,
                  "&::after": { content: "''", bgcolor: "warning.main", width: "60%", height: "60%" },
                },
              })}
              slotProps={{ rail: { style: { height: 6, background: "#E9E9E9" } } }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between", transform: "translateY(-10px)" }}>
              <Typography variant="body2" sx={{ cursor: "pointer", fontSize: 12, fontWeight: 500, color: "grey.600" }}>
                Min
              </Typography>
              <Typography variant="body2" sx={{ cursor: "pointer", fontSize: 12, fontWeight: 500, color: "grey.600" }}>
                Max
              </Typography>
            </Box>
          </Box>
          <Typography sx={{ fontSize: 12, fontWeight: 500, color: "grey.600", width: "100%", minWidth: "100%", mb: 1.5 }}>
            Min Price Per Acre:{" "}
            <Typography component="span" sx={{ fontSize: 12, fontWeight: 500, color: "black" }}>
              {data?.range.min && numFormatter.format(data?.range.min)}
            </Typography>
          </Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 500, color: "grey.600", width: "100%", minWidth: "100%" }}>
            Max Price Per Acre:{" "}
            <Typography component="span" sx={{ fontSize: 12, fontWeight: 500, color: "black" }}>
              {data?.range.max && numFormatter.format(data?.range.max)}
            </Typography>
          </Typography>
        </Box>
        {/* <Box
          sx={(theme) => ({
            border: `1px solid ${theme.palette.grey[100]}`,
            borderRadius: 4,
            px: { xs: 2, md: 3 },
            py: { xs: 3, md: 4 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            transition: "all 0.3s",
            "&:hover": {
              bgcolor: "green.100",
              border: `1px solid ${theme.palette.green[400]}`,
            },
          })}
        >
          <Typography sx={{ fontSize: 12, color: "grey.800", fontWeight: 500, mb: 1.5 }}>We buy for</Typography>
          <Typography
            sx={{
              fontSize: getFontSize(numFormatter.format((data?.price || 0 * 60) / 100)),
              fontWeight: 600,
              mb: 4,
              color: "primary.main",
            }}
          >
            {data?.price && numFormatter.format((data.price * 60) / 100)}
          </Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 500, textAlign: "center", mb: 4 }}>
            Sell your property{" "}
            <Typography component="span" sx={{ color: "primary.main", fontWeight: 500 }}>
              NOW
            </Typography>
            , hassle free <br /> and no closing costs for.
          </Typography>
          <Button variant="contained" sx={{ width: "100%" }} onClick={() => onSell("instantsale")}>
            Sell your property NOW
          </Button>
        </Box> */}
      </Box>
      {/* <Divider sx={{ fontSize: 14, fontWeight: 500, color: "grey.800" }}>OR</Divider> */}
      <Box sx={{ display: "grid", gridTemplateColumns: onlySmallScreen ? "1fr" : "1fr 1fr", gap: 2 }}>
        <Box
          sx={(theme) => ({
            border: `1px solid ${theme.palette.grey[100]}`,
            borderRadius: 4,
            px: { xs: 2, md: 3 },
            py: { xs: 3, md: 4 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            transition: "all 0.3s",
            "&:hover": {
              bgcolor: "green.100",
              border: `1px solid ${theme.palette.green[400]}`,
            },
          })}
        >
          <Box sx={{ position: "relative", width: 44, height: 44, mb: 2.5 }}>
            <Image fill src="/Group 1000004531.svg" alt="" />
          </Box>
          <Typography sx={{ fontSize: 16, fontWeight: 500, mb: 4, textAlign: "center" }}>
            Submit your property to <br /> our network of investors.
          </Typography>
          <Button variant="outlined" sx={{ width: "100%" }} onClick={() => onSell("sale")}>
            Submit your property
          </Button>
        </Box>
        <Box
          sx={(theme) => ({
            border: `1px solid ${theme.palette.grey[100]}`,
            borderRadius: 4,
            px: { xs: 2, md: 3 },
            py: { xs: 3, md: 4 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            transition: "all 0.3s",
            "&:hover": {
              bgcolor: "green.100",
              border: `1px solid ${theme.palette.green[400]}`,
            },
          })}
        >
          <Box sx={{ position: "relative", width: 44, height: 44, mb: 2.5 }}>
            <Image fill src="/Group 1000004531.svg" alt="" />
          </Box>
          <Typography sx={{ fontSize: 16, fontWeight: 500, mb: 4, textAlign: "center" }}>
            Get top dollar by working with <br /> a preferred real estate broker.
          </Typography>
          <Button variant="outlined" sx={{ width: "100%" }}>
            Connect to a broker
          </Button>
        </Box>
      </Box>
      {selectedRegridItem && data && (
        <Box sx={{ height: 366, width: "100%", display: { xs: "block", lg: "none" }, "& > div": { borderRadius: 4 } }}>
          <Map
            geolibInputCoordinates={[[Number(selectedRegridItem.properties.fields.lat), Number(selectedRegridItem.properties.fields.lon)]]}
            zoom={10}
            data={[
              {
                centerCoordinate: [Number(selectedRegridItem.properties.fields.lat), Number(selectedRegridItem.properties.fields.lon)],
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
                    {formatCompactNumber(data.price)}
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
              ...data.properties.map((el) => ({
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
        </Box>
      )}
    </Box>
  );
};

export default FindPropertyCalculatesPrices;
