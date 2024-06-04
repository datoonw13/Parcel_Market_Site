"use client";

import { Box, useMediaQuery, useTheme } from "@mui/material";
import { ILandsMarketplaceFilters } from "@/types/lands-marketplace";
import { Dispatch, SetStateAction } from "react";
import LandsMarketplaceDesktopFilters from "./desktop/LandsMarketplaceDesktopFilters";
import LandsMarketplaceMobileFilters from "./mobile/LandsMarketplaceMobileFilters";

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
    <Box>Sorts</Box>
  </Box>
);

export default LandsMarketplaceFilters;
