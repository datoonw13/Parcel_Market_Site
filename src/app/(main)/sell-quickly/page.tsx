"use client";

import { Box, Button, Container, Divider, Typography, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import React from "react";

const SellQuickly = () => {
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <>
      <Container sx={{ py: { xs: 6, md: 8, lg: 10 }, display: "flex", flexDirection: "column", gap: 4.5 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography sx={{ fontSize: { xs: 24, sm: 28, md: 32, lg: 36 }, textAlign: "center", fontWeight: 600 }}>
            Sell Quickly With No Closing Expenses
          </Typography>
          <Typography sx={{ fontSize: 16, textAlign: "center", mt: { xs: 1.5, sm: 2, md: 3 }, fontWeight: { md: 500 } }}>
            Get quick cash for your property, with zero closing costs and zero hassle with our Parcel Market Purchase Option.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography sx={{ fontWeight: 400, fontSize: 14, color: "grey.800" }}>
            For sellers who are looking to <b>liquidate quickly and with no closing expenses,</b> our Parcel Market Purchase Option may be
            the right fit. Under this option, Parcel Market will make an offer to buy your land based on the VOLT value. If accepted, we
            will handle everything from contracts to closing! You will also be able to close remotely, at your convenience. As an added
            benefit and peace of mind, Parcel Market will pay a third-party attorney of your choice to review the purchase agreement on your
            behalf.
          </Typography>
          <Typography sx={{ fontWeight: 400, fontSize: 14, color: "grey.800" }}>
            While our Parcel Market Purchase Option offers the fastest way to sell your land with no closing expenses and via a remote
            closing, it&apos;s important to note that the offer will be below the VOLT value and therefore likely below the market value of
            your property. This option is ideal for sellers looking for a <b>quick and hassle-free sale</b>, prioritizing speed and
            convenience over maximizing sale price.
          </Typography>
          <Typography sx={{ fontWeight: 400, fontSize: 14, color: "grey.800" }}>
            <b>Sell your property now</b> Takes users to VOLT where they value land and view our offer. a User clicks accept or decline.{" "}
            <br />
            <b>IF Accept à submit</b> contact information form with message that says we will reach out to you shortly à We call them and
            get the process started. <br />
            <b>IF User clicks Decline</b> à presented with other two options: <br />
            <b>The Parcel Marketplace or Preferred Professional Network</b> à User chooses and navigates to those pages, respectively.{" "}
            <br />
          </Typography>
          <Button sx={{ width: "fit-content", m: "auto" }} variant="contained">
            Sell Your Property Now
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default SellQuickly;
