import LandsMarketplaceSearch from "@/components/lands-marketplace/LandsMarketplaceSearch";
import SectionHeader from "@/components/shared/SectionHeader";
import { Box, Container, TextField } from "@mui/material";
import React from "react";

const page = () => (
  <Container sx={{ py: { xs: 3, md: 4 } }}>
    <SectionHeader
      title="Lands Marketplace"
      desc="Welcome to Parcel Market and thank You for being here. At Parcel Market, our goal is simple, to provide a FREE and convenient place to start when making decisions regarding vacant land. "
    />
    <LandsMarketplaceSearch />
  </Container>
);

export default page;
