import { useLazyCalculatePriceQuery } from "@/lib/features/apis/propertyApi";
import { IFindPropertyEstimatedPrice, IFindPropertyEstimatedPriceResponse } from "@/types/find-property";
import { IMap, IMapItem } from "@/types/map";
import { PlaceOutlined } from "@mui/icons-material";
import { Box, Button, Divider, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import React, { Dispatch, SetStateAction, useEffect } from "react";

const Map = dynamic(() => import("@/components/shared/Map"), { ssr: false });

interface IProps {
  data: IMap;
  selectedRegridItem: IMapItem | null;
  setSelectedRegridItem: Dispatch<SetStateAction<IMapItem | null>>;
  goBack: () => void;
  onNext: (data: IFindPropertyEstimatedPriceResponse) => void;
}

const FindPropertyFoundedParcels = ({ data, selectedRegridItem, setSelectedRegridItem, goBack, onNext }: IProps) => {
  const [calculatePrice] = useLazyCalculatePriceQuery();

  useEffect(() => {
    if (data.length === 1) {
      setSelectedRegridItem(data[0]);
    }
  }, [data, setSelectedRegridItem]);

  const onSubmit = async () => {
    if (!selectedRegridItem) {
      return;
    }
    const reqData: IFindPropertyEstimatedPrice = {
      body: {
        county: selectedRegridItem?.properties.fields.county.toLocaleLowerCase(),
        state: selectedRegridItem?.properties.fields.state2.toLocaleLowerCase(),
        parcelNumber: selectedRegridItem?.properties.fields.parcelnumb,
        owner: selectedRegridItem.properties.fields.owner,
        propertyType: selectedRegridItem.properties.fields?.zoning_description || selectedRegridItem.properties.fields.usedesc || "",
      },
      queryParams: {
        acre: selectedRegridItem.properties.fields.ll_gisacre.toString(),
        lat: selectedRegridItem.properties.fields.lat,
        lon: selectedRegridItem.properties.fields.lon,
      },
    };
    try {
      const res = await calculatePrice({ ...reqData }).unwrap();
      onNext(res.data);
    } catch (error) {}
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", mt: { xs: 1, md: 0 } }}>
      <Box sx={{ px: { xs: 2, md: 3, lg: 4, mb: 3 }, height: "100%" }}>
        <Box
          sx={(theme) => ({
            border: { xs: `1px solid transparent`, md: `1px solid ${theme.palette.grey[100]}` },
            borderRadius: 4,
            p: { md: 3, lg: 4 },
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: { xs: 1.5, md: 2 },
          })}
        >
          <Box sx={{ borderRadius: 4, height: { xs: 240, sm: 230, md: 220, lg: 200 }, "& > div": { borderRadius: 4 } }}>
            {data.length > 0 && (
              <Map
                data={data.map((el) => ({
                  centerCoordinate: [Number(el.properties.fields.lat), Number(el.properties.fields.lon)],
                  polygon: el.geometry.coordinates,
                  owner: el.properties.fields.owner,
                  parcelNumber: el.properties.fields.parcelnumb,
                  showMarker: true,
                  markerColor: "default",
                  popup: {
                    owner: {
                      label: "Owner",
                      value: el.properties.fields.owner,
                    },
                    parcelNumber: {
                      label: "Parcel Number",
                      value: el.properties.fields.parcelnumb,
                    },
                    showSelectButton: data.length > 1,
                  },
                }))}
                selectedParcelNumber={selectedRegridItem?.properties.fields.parcelnumb || ""}
                onSelect={(parcelNumber) => {
                  const item = data.find((el) => el.properties.fields.parcelnumb === parcelNumber);
                  setSelectedRegridItem(item || null);
                }}
                onDiscard={() => setSelectedRegridItem(null)}
                zoom={5}
                geolibInputCoordinates={data.map((el) => [Number(el.properties.fields.lat), Number(el.properties.fields.lon)])}
              />
            )}
          </Box>
          <Box
            sx={(theme) => ({
              border: `1px solid ${theme.palette.grey[100]}`,
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              "& > div:not(:last-child)": {
                borderBottom: `1px solid ${theme.palette.grey[100]}`,
              },
              "& > div:first-child": data.length === 1 && {
                borderRadius: 3,
              },
            })}
          >
            {data.map((item) => (
              <Box
                key={item.properties.fields.parcelnumb}
                onClick={() => setSelectedRegridItem(item)}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  p: 1.5,
                  cursor: "pointer",
                  transition: "all 0.1s",
                  "&:hover": {
                    bgcolor:
                      selectedRegridItem?.properties.fields.parcelnumb === item.properties.fields.parcelnumb ? "primary.100" : "primary.50",
                  },
                  bgcolor:
                    selectedRegridItem?.properties.fields.parcelnumb === item.properties.fields.parcelnumb ? "primary.100" : "transparent",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <PlaceOutlined fontSize="small" />
                  <Typography sx={{ fontSize: 14, color: "grey.600" }}>
                    Parcel Number:{" "}
                    <Typography sx={{ color: "black", fontSize: 14 }} component="span">
                      #{item.properties.fields.parcelnumb}
                    </Typography>
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 14, color: "grey.600" }}>
                  Acreages{" "}
                  <Typography sx={{ color: "black", fontSize: 14 }} component="span">
                    {item.properties.fields.ll_gisacre.toFixed(2)} Acres
                  </Typography>
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Divider sx={{ mt: 4 }} />
      <Box
        sx={{
          mt: 2,
          px: { xs: 2, md: 3, lg: 4, mb: 3 },
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Button sx={{ width: { xs: "100%", sm: "fit-content" } }} variant="outlined" onClick={goBack}>
          Back
        </Button>
        <Button disabled={!selectedRegridItem} sx={{ width: { xs: "100%", sm: "fit-content" } }} variant="contained" onClick={onSubmit}>
          Find out Your Estimated Sale Price
        </Button>
      </Box>
    </Box>
  );
};

export default FindPropertyFoundedParcels;
