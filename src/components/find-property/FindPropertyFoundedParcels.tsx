import { PlaceOutlined } from "@mui/icons-material";
import { Box, Button, Divider, Typography } from "@mui/material";
import React from "react";
import SimpleBar from "simplebar-react";

const FindPropertyFoundedParcels = () => (
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
        <Box sx={{ bgcolor: "primary.main", borderRadius: 4, height: { xs: 240, sm: 230, md: 220, lg: 200 } }}>MAP</Box>
        <Box
          sx={(theme) => ({
            border: `1px solid ${theme.palette.grey[100]}`,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            "& > div:not(:last-child)": {
              borderBottom: `1px solid ${theme.palette.grey[100]}`,
            },
          })}
        >
          {new Array(20).fill(0).map(() => (
            <Box
              key={Math.random()}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                p: 1.5,
                cursor: "pointer",
                transition: "all 0.1s",
                "&:hover": { bgcolor: false ? "primary.100" : "primary.50" },
                bgcolor: false ? "primary.100" : "transparent",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <PlaceOutlined fontSize="small" />
                <Typography sx={{ fontSize: 14, color: "grey.600" }}>
                  Parcel Number{" "}
                  <Typography sx={{ color: "black", fontSize: 14 }} component="span">
                    {" "}
                    #123456789
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
      <Button sx={{ width: { xs: "100%", sm: "fit-content" } }} variant="outlined">
        Back
      </Button>
      <Button sx={{ width: { xs: "100%", sm: "fit-content" } }} variant="contained">
        Tell us about your property
      </Button>
    </Box>
  </Box>
);

export default FindPropertyFoundedParcels;
