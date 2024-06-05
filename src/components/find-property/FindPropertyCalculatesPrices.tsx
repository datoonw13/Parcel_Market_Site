import { numFormatter } from "@/helpers/common";
import routes from "@/helpers/routes";
import { setSelectedParcelOptions } from "@/lib/features/slices/authedUserSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { IFindPropertyEstimatedPriceResponse, ISellProperty } from "@/types/find-property";
import { IMapItem } from "@/types/map";
import { Box, Button, Divider, Slider, Typography, useMediaQuery, useTheme } from "@mui/material";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";

const FindPropertyCalculatePriceMap = dynamic(() => import("@/components/find-property/FindPropertyCalculatePriceMap"), {
  ssr: false,
});

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

const FindPropertyCalculatesPrices = ({
  data,
  selectedRegridItem,
  onNext,
}: {
  data: IFindPropertyEstimatedPriceResponse | null;
  selectedRegridItem: IMapItem | null;
  onNext: () => void;
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.authedUser.user);
  const theme = useTheme();
  const onlySmallScreen = useMediaQuery(theme.breakpoints.down(650));

  const onSell = (sellerType: ISellProperty["sellerType"]) => {
    if (!data || !selectedRegridItem) {
      return;
    }
    dispatch(
      setSelectedParcelOptions({
        state: selectedRegridItem?.properties.fields.state2,
        county: selectedRegridItem?.properties.fields.county,
        propertyType: selectedRegridItem?.properties?.fields?.zoning_description || selectedRegridItem?.properties?.fields?.usedesc || "",
        acrage: selectedRegridItem.properties.fields.ll_gisacre,
        parcelNumber: selectedRegridItem?.properties.fields.parcelnumb,
        sellerType,
        owner: selectedRegridItem.properties.fields.owner,
        salePrice: data?.price || 0,
        accepted: true,
        coordinates: JSON.stringify(selectedRegridItem.geometry.coordinates),
        lat: selectedRegridItem.properties.fields.lat,
        lon: selectedRegridItem.properties.fields.lon,
      })
    );
    if (!user) {
      router.push(routes.auth.signIn);
    } else {
      onNext();
    }
  };
  return (
    <Box sx={{ display: "grid", gap: { xs: 3, md: 4 }, px: { xs: 2, md: 3, lg: 4, mb: 3 } }}>
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
          <Typography sx={{ fontSize: 12, color: "grey.800", fontWeight: 500, mb: 1.5 }}>We buy for</Typography>
          <Typography
            sx={{
              fontSize: getFontSize(numFormatter.format((data?.price || 0 * 50) / 100)),
              fontWeight: 600,
              mb: 4,
              color: "primary.main",
            }}
          >
            {data?.price && numFormatter.format((data.price * 50) / 100)}
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
        </Box>
      </Box>
      <Divider sx={{ fontSize: 14, fontWeight: 500, color: "grey.800" }}>OR</Divider>
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
          <Button variant="outlined" sx={{ width: "100%" }} onClick={() => onSell("saleonmarketplace")}>
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
          <FindPropertyCalculatePriceMap price={data.price} mainParcel={selectedRegridItem} parcels={data.properties} />
        </Box>
      )}
    </Box>
  );
};

export default FindPropertyCalculatesPrices;
