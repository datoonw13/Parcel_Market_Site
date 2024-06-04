"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { ArrowRight2 } from "iconsax-react";
import React from "react";

interface IProps {
  title: string;
  desc: string;
}

const SectionHeader = ({ desc, title }: IProps) => {
  const theme = useTheme();
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.8 }}>
        <Typography sx={{ fontSize: { xs: 12, sm: 14 }, color: "grey.800" }}>Homepage</Typography>
        <ArrowRight2 variant="Bold" color={theme.palette.primary.main} size={16} />
        <Typography sx={{ fontSize: { xs: 12, sm: 14 }, fontWeight: 500, color: "primary.main" }}>Route</Typography>
      </Box>
      <Box>
        <Typography
          component="h1"
          sx={{ fontSize: { xs: 24, sm: 28, md: 32, lg: 36 }, fontWeight: 600, textAlign: "center", mb: 3, mt: 5 }}
        >
          {title}
        </Typography>
        {desc && <Typography sx={{ fontSize: 16, fontWeight: 500, textAlign: "center", maxWidth: 736, m: "auto" }}>{desc}</Typography>}
      </Box>
    </Box>
  );
};

export default SectionHeader;
