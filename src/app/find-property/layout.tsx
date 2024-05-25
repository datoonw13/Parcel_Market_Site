"use client";

import FindPropertyHeader from "@/components/find-property/FindPropertyHeader";
import FbIcon from "@/icons/FbIcon";
import TwitterIcon from "@/icons/TwitterIcon";
import { Box, Divider, Typography, alpha } from "@mui/material";
import Image from "next/image";
import React, { ReactElement } from "react";

const FindPropertyLayout = ({ children }: { children: ReactElement }) => (
  <Box sx={{ height: "100vh", display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 400px", xl: "1fr 544px" } }}>
    <Box sx={{ px: { xs: 2.5, sm: 3.5, md: 5, lg: 6.5, xl: 8 }, display: "flex", flexDirection: "column" }}>
      <FindPropertyHeader />
      {children}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1.5,
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          pt: { xs: 3, sm: 3.5, md: 4, lg: 5 },
          pb: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5, alignItems: "center" }}>
          <Typography sx={{ fontSize: 14, color: "grey.800", "&:hover": { fontWeight: 600 }, cursor: "pointer" }}>
            Privacy Policy
          </Typography>
          <Divider orientation="vertical" sx={{ width: 2, height: 16 }} />
          <Typography sx={{ fontSize: 14, color: "grey.800", "&:hover": { fontWeight: 600 }, cursor: "pointer" }}>Terms of use</Typography>
        </Box>
        <Typography sx={{ fontSize: 12, fontWeight: 500, color: "grey.600" }}>
          ©{new Date().getFullYear()} Parcel Market. All rights reserved.
        </Typography>
      </Box>
    </Box>
    <Box sx={{ position: "relative", display: { xs: "none", lg: "block" } }}>
      <Box sx={{ position: "sticky", width: "100%", height: "100vh", top: 0 }}>
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
          <Image alt="" src="/parcel-find-cover.png" fill style={{ objectFit: "cover" }} />
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
        </Box>
      </Box>
    </Box>
  </Box>
);

export default FindPropertyLayout;
