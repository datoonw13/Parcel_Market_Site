import { AppBarMini } from "@/components/app-bar";
import { MiniFooter } from "@/components/footer";
import { Box, Paper } from "@mui/material";
import React, { ReactElement } from "react";

const layout = ({ children }: { children: ReactElement }) => (
  <Box sx={{ px: { xs: 2.5, sm: 4.5, md: 6.5, lg: 8 }, display: "flex", flexDirection: "column", height: "100%" }}>
    <AppBarMini />
    <Paper
      sx={{
        maxWidth: 736,
        width: "100%",
        p: { xs: 2.5, sm: 4.5, md: 6.5, lg: 8 },
        mx: "auto",
        boxShadow: { xs: 0, sm: 1 },
        height: "100%",
        borderRadius: 3,
      }}
    >
      {children}
    </Paper>
    <MiniFooter sx={{ mt: "auto" }} />
  </Box>
);

export default layout;
