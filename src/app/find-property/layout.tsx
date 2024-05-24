import { Box } from "@mui/material";
import Image from "next/image";
import React, { ReactElement } from "react";

const FindPropertyLayout = ({ children }: { children: ReactElement }) => (
  <Box sx={{ height: "100vh", display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 400px", xl: "1fr 544px" } }}>
    <Box>{children}</Box>
    <Box sx={{ position: "relative", display: { xs: "none", lg: "block" } }}>
      <Image alt="" src="/parcel-find-cover.png" fill style={{ objectFit: "cover" }} />
    </Box>
  </Box>
);

export default FindPropertyLayout;
