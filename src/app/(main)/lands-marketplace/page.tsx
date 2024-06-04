import LandsMarketplaceFilters from "@/components/lands-marketplace/LandsMarketplaceFilters";
import LandsMarketplaceSearch from "@/components/lands-marketplace/LandsMarketplaceSearch";
import SectionHeader from "@/components/shared/SectionHeader";
import { Box, Container, TextField } from "@mui/material";
import React from "react";

const page = () => (
  <Container sx={{ py: { xs: 3, md: 4 }, display: "flex", flexDirection: "column" }}>
    <SectionHeader
      title="Lands Marketplace"
      desc="Welcome to Parcel Market and thank You for being here. At Parcel Market, our goal is simple, to provide a FREE and convenient place to start when making decisions regarding vacant land. "
    />
    <Box
      sx={{
        maxWidth: 416,
        width: "100%",
        m: "auto",
        mt: 4,
      }}
    >
      <LandsMarketplaceSearch />
    </Box>
    <Box sx={{ mt: { xs: 5, md: 6 } }}>
      <LandsMarketplaceFilters />
    </Box>
  </Container>
);

export default page;
