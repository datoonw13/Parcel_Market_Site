import { Box } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";
import { ILandsMarketplaceFilters } from "@/types/lands-marketplace";
import LandsMarketplaceDesktopSort from "./LandsMarketplaceDesktopSort";
import LandsMarketplaceMobileSort from "./LandsMarketplaceMobileSort";

interface IProps {
  filters: ILandsMarketplaceFilters;
  setFilters: Dispatch<SetStateAction<ILandsMarketplaceFilters>>;
}

const LandsMarketPlaceSort = ({ filters, setFilters }: IProps) => (
  <Box>
    <Box sx={{ display: { xs: "none", md: "block" } }}>
      <LandsMarketplaceDesktopSort filters={filters} setFilters={setFilters} />
    </Box>
    <Box sx={{ display: { xs: "block", md: "none" } }}>
      <LandsMarketplaceMobileSort filters={filters} setFilters={setFilters} />
    </Box>
  </Box>
);

export default LandsMarketPlaceSort;
