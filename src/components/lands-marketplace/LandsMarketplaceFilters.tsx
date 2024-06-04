"use client";

import { Box } from "@mui/material";
import { ILandsMarketplaceFilters } from "@/types/lands-marketplace";
import { Dispatch, SetStateAction, useState } from "react";
import LandsMarketplaceDesktopFilters from "./desktop-filters/LandsMarketplaceDesktopFilters";

interface IProps {
  filters: ILandsMarketplaceFilters;
  setFilters: Dispatch<SetStateAction<ILandsMarketplaceFilters>>;
}

const LandsMarketplaceFilters = ({ filters, setFilters }: IProps) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, alignItems: "center" }}>
    <Box>
      <LandsMarketplaceDesktopFilters filters={filters} setFilters={setFilters} />
    </Box>
    <Box>Sorts</Box>
  </Box>
);

export default LandsMarketplaceFilters;
