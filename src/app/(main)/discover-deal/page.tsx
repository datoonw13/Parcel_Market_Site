"use client";

import DiscoverDeal from "@/components/discover-deal/DiscoverDeal";
import DiscoverDealProcessBoxMobile from "@/components/discover-deal/DiscoverDealProcessBoxMobile";
import BreadCrumb from "@/components/shared/BreadCrumb";
import routes from "@/helpers/routes";
import { ErrorOutlineOutlined } from "@mui/icons-material";
import { Alert, Box, Button, Container, Divider, Typography, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SellQuickly = () => {
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <>
      <Container sx={{ pb: { xs: 6, md: 8, lg: 10 }, pt: { xs: 3, md: 4 }, display: "flex", flexDirection: "column", gap: 4.5 }}>
        <BreadCrumb routName="Discover your next Land Deal" />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography sx={{ fontSize: { xs: 24, sm: 28, md: 32, lg: 36 }, textAlign: "center", fontWeight: 600 }}>
            Discover Your next Land Deal
          </Typography>
          <Typography
            sx={{ fontSize: 16, textAlign: "center", mt: { xs: 1.5, sm: 2, md: 3 }, fontWeight: { md: 500 }, maxWidth: 600, m: "auto" }}
          >
            Utilize The Parcel Market Marketplace to discover new land deals or expose your property to investors.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Typography sx={{ fontWeight: 400, fontSize: 14, color: "grey.800" }}>
            The Parcel Market Marketplace focuses on <b>connecting buyers and sellers</b>, and is designed for investors seeking attractive
            property deals and sellers looking to quickly liquidate their land with minimal hassle and closing expenses.
          </Typography>
          <Typography sx={{ fontWeight: 400, fontSize: 14, color: "grey.800" }}>
            While many websites connect buyers and sellers for both on-market and off-market properties, The Parcel Market Marketplace
            stands out with its unique approach that benefits both sellers and investors . Our platform provides sellers with{" "}
            <b>efficient, hassle-free options to quickly sell their land,</b> while also{" "}
            <b>granting investors access to motivated sellers and exclusive property deals.</b>
          </Typography>
          <Typography sx={{ fontWeight: 400, fontSize: 14, color: "grey.800" }}>
            We focus on creating a seamless experience for all parties involved, ensuring a win-win situation for sellers and investors. At
            Parcel Market, transparency is key. We want our users to know that our platform focuses on providing value through discounted
            land acquisitions and convenient selling opportunities. Our goal is to facilitate fair and beneficial transactions for all
            parties involved.
          </Typography>
          <Link href={routes.propertySearch.root}>
            <Button sx={{ width: "fit-content", m: "auto", display: "flex" }} variant="contained">
              Start free trial
            </Button>
          </Link>
          <Alert sx={{ bgcolor: "green.50", p: 2.5, borderRadius: 2.5 }} icon={<ErrorOutlineOutlined sx={{ color: "green.600" }} />}>
            <Box sx={{ fontWeight: 500, fontSize: 14, color: "grey.800", mb: 0.5 }}>
              1. User Subscribes to platform enters their dashboard where user can post and make offers to buy land on land listings and
              view all of their activity.
            </Box>
            <Box sx={{ fontWeight: 500, fontSize: 14, color: "grey.800" }}>
              2. Marketplace is a classified type platform with land listings.
            </Box>
          </Alert>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            mt: { xs: 6, sm: 8, md: 10, lg: 11 },
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: { xs: 24, sm: 28, md: 32, lg: 36 },
              mb: 8,
            }}
          >
            Our Process
          </Typography>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <DiscoverDeal />
          </Box>
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <DiscoverDealProcessBoxMobile />
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default SellQuickly;
