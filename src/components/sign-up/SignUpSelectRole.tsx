"use client";

import routes from "@/helpers/routes";
import RealEstateProfessionalIcon from "@/icons/RealEstateProfessionalIcon";
import SellerRoleIcon from "@/icons/SellerRoleIcon";
import { ISignUp } from "@/types/auth";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";

interface IProps {
  setType: Dispatch<SetStateAction<ISignUp["type"] | null>>;
  type: ISignUp["type"] | null;
  onNext: () => void;
}

const SignUpSelectRole = ({ setType, type, onNext }: IProps) => (
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
        onClick={() => setType(1)}
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          gap: 4,
          alignItems: "center",
          borderRadius: 4,
          border: `1px solid ${type === 1 ? theme.palette.green[400] : theme.palette.grey[100]}`,
          bgcolor: type === 1 ? "primary.100" : "transparent",
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
        onClick={() => setType(2)}
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          gap: 4,
          alignItems: "center",
          borderRadius: 4,
          border: `1px solid ${type === 2 ? theme.palette.green[400] : theme.palette.grey[100]}`,
          bgcolor: type === 2 ? "primary.100" : "transparent",
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
    <Button variant="contained" sx={{ mt: "auto" }} onClick={onNext}>
      Create Account
    </Button>
    <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
      Already have an account?{" "}
      <Link href={routes.auth.signIn}>
        <Typography component="span" sx={{ fontWeight: 500, fontSize: 14, textDecoration: "underline", color: "primary.main" }}>
          Sign In
        </Typography>
      </Link>
    </Typography>
  </Box>
);

export default SignUpSelectRole;
