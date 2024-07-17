import { Box, Button, Container, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

const LandingSection1 = () => (
  <Container
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
      alignItems: "center",
      gap: { xs: 3 },
    }}
  >
    <Typography sx={{ fontWeight: 600, fontSize: { xs: 24, sm: 28 }, textAlign: "center", display: { md: "none" } }}>
      The Parcel Market <br /> value of land tool
    </Typography>
    <Box boxShadow={0} sx={{ position: "relative", width: "100%", height: { xs: 230, sm: "45vw", md: 350, lg: 400 }, borderRadius: 4 }}>
      <Image alt="" src="/volt.png" fill />
    </Box>
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography sx={{ fontWeight: 600, fontSize: { xs: 24, sm: 28, md: 32, lg: 36 }, mb: 1.5, display: { xs: "none", md: "flex" } }}>
        VOLT - Value of Land Tool
      </Typography>
      <Typography sx={{ fontSize: 14, color: "grey.800" }}>
        VOLT is the first free, no obligation land value information tool to hit the web! By using proprietary algorithms and county sale
        data, VOLT is able to estimate an average value for similar sized properties in a market area. You can also use VOLT to search,
        save, and export county sale data.
      </Typography>
      <Button sx={{ width: { xs: "100%", md: "fit-content" }, mt: 4 }} variant="contained">
        Continue Reading
      </Button>
    </Box>
  </Container>
);

export default LandingSection1;
