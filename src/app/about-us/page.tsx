"use client";

import { Box, Container, Typography, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import React from "react";

const AboutUs = () => {
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <Container>
      <Box sx={{ py: { xs: 10, md: 11, lg: 12.5 }, display: "flex", flexDirection: "column", gap: 4.5 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography sx={{ fontSize: { xs: 24, sm: 28, md: 32, lg: 36 }, textAlign: "center", fontWeight: 600 }}>About us</Typography>
          <Typography sx={{ fontSize: 16, textAlign: "center", mt: { xs: 1.5, sm: 2, md: 3 }, fontWeight: { md: 500 } }}>
            Welcome to Parcel Market and thank You for being here. At Parcel Market, our goal is simple, to provide a FREE and convenient
            place to start when making decisions regarding vacant land.{" "}
          </Typography>
        </Box>
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              height: {
                xs: 240,
                sm: 340,
                md: 440,
                lg: 530,
                position: "relative",
                "& > img": {
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  borderBottomLeftRadius: upMd ? 16 : 0,
                  borderBottomRightRadius: upMd ? 16 : 0,
                },
              },
            }}
          >
            <Image alt="" src="/people.png" fill loading="eager" style={{ transform: "scaleX(-1)" }} />
          </Box>
          <Box
            sx={{
              px: 2.5,
              py: 2,
              p: { md: 4.5 },
              bgcolor: "primary.200",
              borderBottomLeftRadius: { xs: 16 },
              borderBottomRightRadius: { xs: 16, md: 0 },
              borderTopRightRadius: { md: 16 },
              fontWeight: 500,
              fontSize: { xs: 14, md: 16 },
              position: { md: "absolute" },
              bottom: 0,
              width: { md: "55%" },
            }}
          >
            “We strive to work closely together with our customers in solving their problems. We value honesty, integrity, and efficiency”
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default AboutUs;
