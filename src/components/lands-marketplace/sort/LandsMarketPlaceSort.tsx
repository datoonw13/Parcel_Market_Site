import { Box } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";
import { ImarketlpaceFilters } from "@/types/lands";
import marketlpaceDesktopSort from "./marketlpaceDesktopSort";
import marketlpaceMobileSort from "./marketlpaceMobileSort";

interface IProps {
  filters: ImarketlpaceFilters;
  setFilters: Dispatch<SetStateAction<ImarketlpaceFilters>>;
}

const marketlpaceSort = ({ filters, setFilters }: IProps) => (
  <Box>
    <Box sx={{ display: { xs: "none", md: "block" } }}>
      <marketlpaceDesktopSort filters={filters} setFilters={setFilters} />
    </Box>
    <Box sx={{ display: { xs: "block", md: "none" } }}>
      <marketlpaceMobileSort filters={filters} setFilters={setFilters} />
    </Box>
  </Box>
);

export default marketlpaceSort;
