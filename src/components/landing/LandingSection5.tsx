import { Box, Container, Typography } from "@mui/material";
import React from "react";

const LandingSection5 = () => (
  <Container
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: { xs: 4, md: 5, lg: 6 },
    }}
  >
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography sx={{ fontSize: 16, textAlign: "center", mb: 0.5, color: "primary.main" }}>FAQ</Typography>
      <Typography sx={{ fontSize: { xs: 24, sm: 28, md: 32, lg: 36 }, textAlign: "center", fontWeight: 600 }}>
        Frequently asked questions
      </Typography>
    </Box>
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 2.5, sm: 3, md: 3.5, lg: 4.5 },
        width: "100%",
        alignItems: { xs: "center", md: "start" },
        justifyContent: "center",
      }}
    >
      ae
    </Box>
  </Container>
);

export default LandingSection5;
