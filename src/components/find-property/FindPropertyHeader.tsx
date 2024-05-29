import { Box } from "@mui/material";
import Link from "next/link";
import React from "react";
import Logo from "@/icons/Logo";
import ResponsiveHeaderMenu from "../app-bar/ResponsiveHeaderMenu";

const FindPropertyHeader = () => (
  <Box
    id="parcel-find-header"
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      pt: { xs: 2, sm: 4, md: 6, lg: 8 },
      pb: 2,
      mb: { xs: 4, md: 3 },
    }}
  >
    <Link href="/">
      <Box sx={{ width: { xs: 85, sm: 110, md: 125, lg: 140 }, cursor: "pointer" }} id="root-header-logo">
        <Logo />
      </Box>
    </Link>
    <Box sx={{ ml: "auto", display: { xs: "flex", lg: "none" } }}>
      <ResponsiveHeaderMenu rootId="parcel-find-header" />
    </Box>
  </Box>
);

export default FindPropertyHeader;
