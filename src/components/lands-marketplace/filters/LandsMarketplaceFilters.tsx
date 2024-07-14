"use client";

import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ImarketlpaceFilters } from "@/types/lands";
import { Dispatch, SetStateAction } from "react";
import marketlpaceDesktopFilters from "./desktop/marketlpaceDesktopFilters";
import marketlpaceMobileFilters from "./mobile/marketlpaceMobileFilters";
import marketlpaceSort from "../sort/marketlpaceSort";

interface IProps {
  filters: ImarketlpaceFilters;
  setFilters: Dispatch<SetStateAction<ImarketlpaceFilters>>;
}

const marketlpaceFilters = ({ filters, setFilters }: IProps) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, alignItems: "center" }}>
    <Box sx={{ display: { xs: "none", md: "block" } }}>
      <marketlpaceDesktopFilters filters={filters} setFilters={setFilters} />
    </Box>
    <Box sx={{ display: { xs: "block", md: "none" } }}>
      <marketlpaceMobileFilters filters={filters} setFilters={setFilters} />
    </Box>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Typography sx={{ fontSize: 12, color: "grey.600", fontWeight: 500 }}>467,000 Lands</Typography>
      <marketlpaceSort filters={filters} setFilters={setFilters} />
    </Box>
  </Box>
);

export default marketlpaceFilters;
