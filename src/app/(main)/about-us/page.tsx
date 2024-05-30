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
      <Divider />
      <Container sx={{ py: { xs: 6, md: 8, lg: 10 }, display: "flex", flexDirection: "column", gap: 4.5 }}>
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
        <Typography sx={{ fontSize: 14, color: "grey.800" }}>
          While the information provided by Parcel Market’s Value Of land Tool (VOLT) is the main driver behind our purpose, we also wanted
          to help our users utilize that information. We understand that the land business can be intimidating and finding qualified buyers,
          sellers, or industry professionals can be quite the endeavor! We decided that providing options for taking the next steps after
          determining land value is also very important. We offer three unique options for our users, and which one is right for you will
          depend on your situation. They are The Parcel Market Purchase Option, The Parcel Market Marketplace, and Our Preferred Land
          Specialists Network. Let’s explain these a bit further so you are well informed on how Parcel Market can help your specific needs.
        </Typography>
        <Box>
          <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 1.5 }}>The Parcel Market Value of Land Tool</Typography>
          <Typography sx={{ fontSize: 14, color: "grey.800" }}>
            While the information provided by Parcel Market’s Value Of land Tool (VOLT) is the main driver behind our purpose, we also
            wanted to help our users utilize that information. We understand that the land business can be intimidating and finding
            qualified buyers, sellers, or industry professionals can be quite the endeavor! We decided that providing options for taking the
            next steps after determining land value is also very important. We offer three unique options for our users, and which one is
            right for you will depend on your situation. They are The Parcel Market Purchase Option, The Parcel Market Marketplace, and Our
            Preferred Land Specialists Network. Let’s explain these a bit further so you are well informed on how Parcel Market can help
            your specific needs.
          </Typography>
        </Box>
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
            Our 3 unique options for users
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
            >
              <Typography sx={{ fontSize: 18, fontWeight: 500 }}>01.</Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 700, width: { md: "max-content" } }}>
                The Parcel Market Purchase Option
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 14, color: "grey.800" }}>
              For sellers who are looking to liquidate quickly and with no closing expenses, our Parcel Market Purchase Option may be the
              right fit. Under this option, Parcel Market will make an offer to buy your land based on the VOLT value. If accepted, we will
              handle everything from contracts to closing! You will also be able to close remotely, at your convenience. As an added benefit
              and peace of mind, Parcel Market will pay a third-party attorney of your choice to review the purchase agreement on your
              behalf. While our Parcel Market Purchase Option offers the fastest way to sell your land with no closing expenses and via a
              remote closing, it&apos;s important to note that the offer will be below the VOLT value and therefore likely below the market
              value of your property. This option is ideal for sellers looking for a quick and hassle-free sale, prioritizing speed and
              convenience over maximizing sale price.
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
            >
              <Typography sx={{ fontSize: 18, fontWeight: 500 }}>01.</Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 700, width: { md: "max-content" } }}>
                The Parcel Market Purchase Option
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 14, color: "grey.800" }}>
              For sellers who are looking to liquidate quickly and with no closing expenses, our Parcel Market Purchase Option may be the
              right fit. Under this option, Parcel Market will make an offer to buy your land based on the VOLT value. If accepted, we will
              handle everything from contracts to closing! You will also be able to close remotely, at your convenience. As an added benefit
              and peace of mind, Parcel Market will pay a third-party attorney of your choice to review the purchase agreement on your
              behalf. While our Parcel Market Purchase Option offers the fastest way to sell your land with no closing expenses and via a
              remote closing, it&apos;s important to note that the offer will be below the VOLT value and therefore likely below the market
              value of your property. This option is ideal for sellers looking for a quick and hassle-free sale, prioritizing speed and
              convenience over maximizing sale price.
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
            >
              <Typography sx={{ fontSize: 18, fontWeight: 500 }}>01.</Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 700, width: { md: "max-content" } }}>
                The Parcel Market Purchase Option
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 14, color: "grey.800" }}>
              For sellers who are looking to liquidate quickly and with no closing expenses, our Parcel Market Purchase Option may be the
              right fit. Under this option, Parcel Market will make an offer to buy your land based on the VOLT value. If accepted, we will
              handle everything from contracts to closing! You will also be able to close remotely, at your convenience. As an added benefit
              and peace of mind, Parcel Market will pay a third-party attorney of your choice to review the purchase agreement on your
              behalf. While our Parcel Market Purchase Option offers the fastest way to sell your land with no closing expenses and via a
              remote closing, it&apos;s important to note that the offer will be below the VOLT value and therefore likely below the market
              value of your property. This option is ideal for sellers looking for a quick and hassle-free sale, prioritizing speed and
              convenience over maximizing sale price.
            </Typography>
          </Box>
        </Box>
      </Container>
      {/* <SubscribeNow />
      <Box sx={{ bgcolor: "white", py: { xs: 10, md: 11, lg: 12.5 } }}>
        <Footer />
      </Box> */}
    </>
  );
};

export default AboutUs;
