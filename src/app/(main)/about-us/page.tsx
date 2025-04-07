"use client";

import { Box, Container, Divider, Typography, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import React from "react";
// import Header from "@/components/header/Header";
// import Footer from "@/components/landing/Footer";
// import SubscribeNow from "@/components/home/SubscribeNow";

const AboutUs = () => {
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <>
      {/* <Header /> */}
      <Container sx={{ py: { xs: 6, md: 8, lg: 10 }, display: "flex", flexDirection: "column", gap: 4.5 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: { xs: 3, sm: 4, md: 5, lg: 6 },
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: {
                xs: 18,
                sm: 22,
                md: 24,
                lg: 28,
              },
            }}
          >
            About Us
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1.5, md: 12 },
              justifyContent: { md: "space-between" },
              flexDirection: { xs: "column", md: "row" },
              alignItems: { md: "start" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                color: "primary.main",
              }}
            />
            <Typography sx={{ fontSize: 14, color: "grey.800" }}>
              Parcel Market was created by a team of seasoned real estate professionals and skilled software developers who share a deep
              understanding of the land industry and a passion for building intuitive technology. Frustrated by the inefficiencies and lack
              of reliable land sales data from county sources, our founders set out to solve a major challenge faced by real estate
              professionals and investors: getting accurate, affordable, and accessible data on vacant land sales—beyond what’s available
              through traditional MLS systems.
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1.5, md: 12 },
              justifyContent: { md: "space-between" },
              flexDirection: { xs: "column", md: "row" },
              alignItems: { md: "start" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                color: "primary.main",
              }}
            />
            <Typography sx={{ fontSize: 14, color: "grey.800" }}>
              We believe land data should be straightforward, easy to access, and focused on what truly drives land value. Instead of
              overwhelming users with unnecessary features and inflated pricing, we’ve built a platform that delivers only what
              matters—reliable data, user-friendly tools, and insights that help professionals make informed decisions without the noice.
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1.5, md: 12 },
              justifyContent: { md: "space-between" },
              flexDirection: { xs: "column", md: "row" },
              alignItems: { md: "start" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                color: "primary.main",
              }}
            />
            <Typography sx={{ fontSize: 14, color: "grey.800" }}>
              At Parcel Market, we stand by our core values: integrity, transparency, and community. As a dedicated team, we’re committed to
              building a trusted, easy-to-use platform that empowers land professionals and investors nationwide. We continuously refine our
              tools to enhance accuracy, usability, and overall experience—while keeping our subscription pricing accessible.
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1.5, md: 12 },
              justifyContent: { md: "space-between" },
              flexDirection: { xs: "column", md: "row" },
              alignItems: { md: "start" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                color: "primary.main",
              }}
            />
            <Typography sx={{ fontSize: 14, color: "grey.800" }}>
              We’re excited about the road ahead as we keep growing and evolving Parcel Market into the essential resource for anyone
              looking to understand and invest in vacant land.
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default AboutUs;
