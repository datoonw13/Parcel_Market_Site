import { Box, Button, Container, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

const LandingSection1 = () => (
  <Container
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
      alignItems: "center",
      gap: { xs: 3, md: 6, lg: 8 },
      py: 8,
    }}
  >
    <Typography sx={{ fontWeight: 600, fontSize: { xs: 24, sm: 28 }, textAlign: "center", display: { md: "none" } }}>
      The Parcel Market value of land tool
    </Typography>
    <Box boxShadow={1} sx={{ position: "relative", width: "100%", height: { xs: 230, sm: "45vw", md: 350, lg: 400 }, borderRadius: 4 }}>
      <Image alt="" src="/volt.png" fill />
    </Box>
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography sx={{ fontWeight: 600, fontSize: 36, mb: 1.5, display: { xs: "none", md: "flex" } }}>
        VOLT - Value of Land Tool
      </Typography>
      <Typography sx={{ fontSize: 14, color: "grey.800" }}>
        Before we get into the Parcel Market options, let’s explain VOLT, Parcel Market’s Value of Land Tool. Our team is proud to have
        developed the first FREE, no obligation land valuation tool to hit the web. We do not ask for any personal information or require
        you to register with us to use VOLT.
      </Typography>
      <Button sx={{ width: { xs: "100%", md: "fit-content" }, mt: 4 }} variant="contained">
        Continue Reading
      </Button>
    </Box>
  </Container>
);

export default LandingSection1;
