"use client";

import { Box, useMediaQuery, useTheme } from "@mui/material";
import { ILandsMarketplaceFilters } from "@/types/lands-marketplace";
import { Dispatch, SetStateAction } from "react";
import LandsMarketplaceDesktopFilters from "./LandsMarketplaceDesktopFilters";
import LandsMarketplaceMobileFilters from "./LandsMarketplaceMobileFilters";

interface IProps {
  filters: ILandsMarketplaceFilters;
  setFilters: Dispatch<SetStateAction<ILandsMarketplaceFilters>>;
}

const LandsMarketplaceFilters = ({ filters, setFilters }: IProps) => {
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, alignItems: "center" }}>
      <Box>
        {upMd ? (
          <LandsMarketplaceDesktopFilters filters={filters} setFilters={setFilters} />
        ) : (
          <LandsMarketplaceMobileFilters filters={filters} setFilters={setFilters} />
        )}
      </Box>
      <Box>Sorts</Box>
    </Box>
  );
};

export default LandsMarketplaceFilters;
