import { ArrowRight } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React from "react";

const BreadCrumb = ({ routName }: { routName: string }) => (
  <Box sx={{ display: "flex", alignItems: "center" }}>
    <Typography sx={{ fontSize: { xs: 12, sm: 14 } }}>Homepage</Typography>
    <ArrowRight sx={{ color: "primary.main" }} />
    <Typography sx={{ fontSize: { xs: 12, sm: 14 }, fontWeight: 500, color: "primary.main" }}>{routName}</Typography>
  </Box>
);

export default BreadCrumb;
