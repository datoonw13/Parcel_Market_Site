"use client";

import { AppBarMini } from "@/components/app-bar";
import { MiniFooter } from "@/components/footer";
import { Box, Paper } from "@mui/material";
import { usePathname } from "next/navigation";
import React, { ReactElement } from "react";

const AuthLayout = ({ children }: { children: ReactElement }) => {
  const pathname = usePathname();

  return (
    <Box sx={{ px: { xs: 2.5, sm: 4.5, md: 6.5, lg: 8 }, display: "flex", flexDirection: "column", height: "100%" }}>
      <AppBarMini />
      <Paper
        sx={{
          maxWidth: 736,
          width: "100%",
          p: { xs: 2.5, sm: 4.5, md: 6.5, lg: 8 },
          mx: "auto",
          boxShadow: { xs: 0, sm: 1 },
          height: pathname.includes("sign-up") ? "auto" : "100%",
          borderRadius: 3,
          mt: pathname.includes("sign-up") ? "auto" : "",
        }}
      >
        {children}
      </Paper>
      <MiniFooter sx={{ mt: "auto" }} />
    </Box>
  );
};

export default AuthLayout;
