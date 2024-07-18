"use client";

import { valueLandAtom } from "@/atoms/value-land-atom";
import { numFormatter } from "@/helpers/common";
import routes from "@/helpers/routes";
import { Box, Slider, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useAtom } from "jotai";
import { LatLngTuple } from "leaflet";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Button from "../../shared/forms/Button";
import CalculatedPriceDetails from "./calculated-price-details";

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

const ValueLandCalculatedPrice = () => {
  const theme = useTheme();
  const onlySmallScreen = useMediaQuery(theme.breakpoints.down(650));
  const router = useRouter();
  const [valueLand, setValueLand] = useAtom(valueLandAtom);
  console.log(valueLand, 22);

  const onSell = () => {
    router.push(routes.valueLand.about.fullUrl);
  };

  // useEffect(() => {
  //   if (!valueLand.calculatedPrice) {
  //     router.replace(routes.valueLand.fullUrl);
  //   }
  // }, [router, valueLand]);

  return (
    <div className="mx-4 md:mx-6 lg:mx-8 ">
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-between">
          <div className="space-y-2">
            <h1 className="text-lg font-semibold">The average price for similar sized property in your area</h1>
            <h2 className="text-grey-800 text-sm">
              To view, save, or export sales data used in this calculation, you must sign in or create an account with us.
            </h2>
          </div>
          <Button className="w-full sm:w-fit min-w-max">Save Search Data</Button>
        </div>
        {valueLand.calculatedPrice && (
          <CalculatedPriceDetails
            voltValue={valueLand.calculatedPrice.price}
            minPricePerAcre={valueLand.calculatedPrice.range.min}
            maxPricePerAcre={valueLand.calculatedPrice.range.max}
            data={valueLand.calculatedPrice.properties.map((el) => el.price / el.arcage)}
            averagePrice={valueLand.calculatedPrice.median_middle_price}
          />
        )}
      </div>
    </div>
  );
};

export default ValueLandCalculatedPrice;

{
  /* <Box sx={{ display: "grid", gap: { xs: 3, md: 4 }, px: { xs: 2, md: 3, lg: 4, mb: 3 } }}>
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
    <Typography sx={{ fontSize: getFontSize(numFormatter.format(valueLand.calculatedPrice?.price || 0)), fontWeight: 600, mb: 4 }}>
      {" "}
      {valueLand.calculatedPrice?.price && numFormatter.format(valueLand.calculatedPrice?.price)}
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
        {valueLand.calculatedPrice?.range.min && numFormatter.format(valueLand.calculatedPrice?.range.min)}
      </Typography>
    </Typography>
    <Typography sx={{ fontSize: 12, fontWeight: 500, color: "grey.600", width: "100%", minWidth: "100%" }}>
      Max Price Per Acre:{" "}
      <Typography component="span" sx={{ fontSize: 12, fontWeight: 500, color: "black" }}>
        {valueLand.calculatedPrice?.range.max && numFormatter.format(valueLand.calculatedPrice?.range.max)}
      </Typography>
    </Typography>
  </Box>
</Box>
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
    <Button variant="outlined" sx={{ width: "100%" }} onClick={() => onSell()}>
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
{valueLand.selectedLand && valueLand.calculatedPrice && (
  <Box sx={{ height: 366, width: "100%", display: { xs: "block", lg: "none" }, "& > div": { borderRadius: 4 } }}>
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
  </Box>
)}
</Box> */
}
