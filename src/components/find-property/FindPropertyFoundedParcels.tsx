import { IMap, IMapItem } from "@/types/map";
import { PlaceOutlined } from "@mui/icons-material";
import { Box, Button, Divider, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import React, { Dispatch, SetStateAction, useEffect } from "react";

const Map = dynamic(() => import("@/components/property-search/Map"), { ssr: false });

interface IProps {
  data: IMap;
  selectedRegridItem: IMapItem | null;
  setSelectedRegridItem: Dispatch<SetStateAction<IMapItem | null>>;
  goBack: () => void;
  onNext: () => void;
}

const FindPropertyFoundedParcels = ({ data, selectedRegridItem, setSelectedRegridItem, goBack, onNext }: IProps) => {
  useEffect(() => {
    if (data.length === 1) {
      setSelectedRegridItem(data[0]);
    }
  }, [data, setSelectedRegridItem]);

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
                data={data}
                selectedParcelNumber={selectedRegridItem?.properties.fields.parcelnumb || ""}
                handleParcelSelect={(val) => setSelectedRegridItem(val)}
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
                    123.34 Acres
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
        <Button disabled={!selectedRegridItem} sx={{ width: { xs: "100%", sm: "fit-content" } }} variant="contained" onClick={onNext}>
          Tell us about your property
        </Button>
      </Box>
    </Box>
  );
};

export default FindPropertyFoundedParcels;
