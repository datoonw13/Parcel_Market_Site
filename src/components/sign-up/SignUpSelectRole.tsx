"use client";

import RealEstateProfessionalIcon from "@/icons/RealEstateProfessionalIcon";
import SellerRoleIcon from "@/icons/SellerRoleIcon";
import { Box, Button, Typography } from "@mui/material";
import React from "react";

const SignUpSelectRole = () => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center", height: "100%" }}>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Typography variant="h1" sx={{ textAlign: "center", fontSize: { xs: 24, sm: 28, md: 32, lg: 36 }, fontWeight: 600 }}>
        Welcome to Parcel Market
      </Typography>
      <Typography sx={{ fontWeight: 500, color: "grey.800", fontSize: { xs: 14, md: 16 }, textAlign: "center" }}>
        Let’s get you set up with an account.
      </Typography>
    </Box>
    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, width: "100%", "& > div": { width: "100%" }, gap: 2 }}>
      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          gap: 4,
          alignItems: "center",
          borderRadius: 4,
          border: `1px solid ${true ? theme.palette.green[400] : theme.palette.grey[100]}`,
          bgcolor: true ? "primary.100" : "transparent",
          p: 4,
          cursor: "pointer",
          "&:hover": {
            boxShadow: 1,
          },
        })}
      >
        <SellerRoleIcon />
        <Typography sx={{ fontWeight: 500, fontSize: 16, textAlign: "center" }}>
          I’m looking to <br /> buy, or sell a property
        </Typography>
      </Box>
      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          gap: 4,
          alignItems: "center",
          borderRadius: 4,
          border: `1px solid ${false ? theme.palette.green[400] : theme.palette.grey[100]}`,
          bgcolor: false ? "primary.100" : "transparent",
          p: 4,
          cursor: "pointer",
          "&:hover": {
            boxShadow: 1,
          },
        })}
      >
        <RealEstateProfessionalIcon />
        <Typography sx={{ fontWeight: 500, fontSize: 16, textAlign: "center" }}>
          I’m a real <br /> estate professional
        </Typography>
      </Box>
    </Box>
    <Button variant="contained" sx={{ mt: "auto" }}>
      Create Account
    </Button>
    <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
      Already have an account?{" "}
      <Typography component="span" sx={{ fontWeight: 500, fontSize: 14, textDecoration: "underline", color: "primary.main" }}>
        Sign In
      </Typography>
    </Typography>
  </Box>
);

export default SignUpSelectRole;
