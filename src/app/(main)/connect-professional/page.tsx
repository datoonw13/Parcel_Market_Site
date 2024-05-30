"use client";

import ConnectProfessionalProcessBox from "@/components/connect-professional/ConnectProfessionalProcessBox";
import ConnectProfessionalProcessBoxMobile from "@/components/connect-professional/ConnectProfessionalProcessBoxMobile";
import BreadCrumb from "@/components/shared/BreadCrumb";
import routes from "@/helpers/routes";
import { ErrorOutlineOutlined } from "@mui/icons-material";
import { Alert, Box, Button, Container, Typography, useMediaQuery, useTheme } from "@mui/material";
import Link from "next/link";
import React from "react";

const SellQuickly = () => {
  const theme = useTheme();
  return (
    <>
      <Container sx={{ pb: { xs: 6, md: 8, lg: 10 }, pt: { xs: 3, md: 4 }, display: "flex", flexDirection: "column", gap: 4.5 }}>
        <BreadCrumb routName="Parcel Market’s Preferred Professional Network" />

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography sx={{ fontSize: { xs: 24, sm: 28, md: 32, lg: 36 }, textAlign: "center", fontWeight: 600 }}>
            Parcel Market’s Preferred Professional Network
          </Typography>
          <Typography
            sx={{ fontSize: 16, textAlign: "center", mt: { xs: 1.5, sm: 2, md: 3 }, fontWeight: { md: 500 }, maxWidth: 600, m: "auto" }}
          >
            Get quick cash for your property, with zero closing costs and zero hassle with our Parcel Market Purchase Option.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Typography sx={{ fontWeight: 400, fontSize: 14, color: "grey.800" }}>
            Navigating a land sale can get complicated fast and having a real estate professional experienced in land transactions can
            really make a difference.
          </Typography>
          <Typography sx={{ fontWeight: 400, fontSize: 14, color: "grey.800" }}>
            For sellers who are looking to get retail value for their land and in a reasonable time frame with minimal headaches, we have
            done the homework for you. Our list of local industry professionals, including{" "}
            <b>real estate agents, title companies, and land appraisers are vetted by Parcel Market</b> to have years of experience and
            assure they are the best of the best in your market area.
          </Typography>
          <Link href={routes.propertySearch.root}>
            <Button sx={{ width: "fit-content", m: "auto", display: "flex" }} variant="contained">
              Connect with Professional
            </Button>
          </Link>
          <Alert sx={{ bgcolor: "green.50", p: 2.5, borderRadius: 2.5 }} icon={<ErrorOutlineOutlined sx={{ color: "green.600" }} />}>
            <Box sx={{ fontWeight: 500, fontSize: 14, color: "grey.800", mb: 0.5 }}>
              1. Preferred Professional Page à Uses users location to identify Professionals in their area. Professional bios will have
              their locations served, years of experience, services offered, and contact information. They will have a link to that
              professional’s webpage.
            </Box>
            <Box sx={{ fontWeight: 500, fontSize: 14, color: "grey.800" }}>
              2. Industry professionals pay to advertise their services on the platform. They will need an application link for this on the
              page and must be approved by the platform. Applicants must have minimum of 2 years with land transaction experience. The
              application will ask
            </Box>
            <Box
              component="ul"
              sx={{
                fontWeight: 500,
                fontSize: 14,
                color: "grey.800",
                listStyleType: "inherit",
                mt: 1,
                "& li": {
                  pl: 2,
                  mb: 1,
                  position: "relative",
                  "&::before": {
                    content: "'•'",
                    left: 0,
                    position: "absolute",
                  },
                },
              }}
            >
              <li>Name</li>
              <li>Services Offered (Appraiser, Re Agent/Broker, Attorney, etc.)</li>
              <li>Areas Served</li>
              <li>Years of experience in Vacant Land transactions</li>
              <li>Accreditation</li>
              <li>Contact</li>
              <li>Webpage link</li>
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
            <ConnectProfessionalProcessBox />
          </Box>
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <ConnectProfessionalProcessBoxMobile />
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default SellQuickly;
