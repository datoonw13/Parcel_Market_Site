"use client";

import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ILandsMarketplaceFilters } from "@/types/lands-marketplace";
import { Dispatch, SetStateAction } from "react";
import LandsMarketplaceDesktopFilters from "./desktop/LandsMarketplaceDesktopFilters";
import LandsMarketplaceMobileFilters from "./mobile/LandsMarketplaceMobileFilters";
import LandsMarketPlaceSort from "../sort/LandsMarketPlaceSort";

interface IProps {
  filters: ILandsMarketplaceFilters;
  setFilters: Dispatch<SetStateAction<ILandsMarketplaceFilters>>;
}

const LandsMarketplaceFilters = ({ filters, setFilters }: IProps) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, alignItems: "center" }}>
    <Box sx={{ display: { xs: "none", md: "block" } }}>
      <LandsMarketplaceDesktopFilters filters={filters} setFilters={setFilters} />
    </Box>
    <Box sx={{ display: { xs: "block", md: "none" } }}>
      <LandsMarketplaceMobileFilters filters={filters} setFilters={setFilters} />
    </Box>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Typography sx={{ fontSize: 12, color: "grey.600", fontWeight: 500 }}>467,000 Lands</Typography>
      <LandsMarketPlaceSort filters={filters} setFilters={setFilters} />
    </Box>
  </Box>
);

export default LandsMarketplaceFilters;
