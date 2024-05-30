"use client";

import { getAllStates } from "@/helpers/states";
import GoogleIcon from "@/icons/GoogleIcon";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Eye, EyeSlash } from "iconsax-react";
import React, { useState } from "react";
import CheckboxIcon from "@/icons/CheckboxIcon";
import CheckboxCheckedIcon from "@/icons/CheckboxCheckedIcon";
import Link from "next/link";
import routes from "@/helpers/routes";
import AutoCompleteListboxComponent from "../shared/AutoCompleteListboxComponent";

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center", height: "100%", m: "auto" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Typography variant="h1" sx={{ textAlign: "center", fontSize: { xs: 24, sm: 28, md: 32, lg: 36 }, fontWeight: 600 }}>
          Sign Up
        </Typography>
        <Typography sx={{ fontWeight: 500, fontSize: 16, textAlign: "center" }}>
          Create account for who’s{" "}
          <Typography component="span" sx={{ fontWeight: 500, fontSize: 16, color: "primary.main" }}>
            Looking to sell
          </Typography>
        </Typography>
      </Box>
      <Box
        sx={{
          "& svg": { width: 24, height: 24 },
          display: "flex",
          gap: 2,
          boxShadow: "0px 2px 3px 0px rgba(0, 0, 0, 0.168)",
          borderRadius: 10,
          py: 1.5,
          justifyContent: "center",
          cursor: "pointer",
          px: 6,
        }}
      >
        <GoogleIcon />
        <Typography sx={{ fontWeight: 500, fontSize: 16, opacity: 0.56 }}>Continue with Google</Typography>
      </Box>
      <Divider>OR</Divider>
      <Box sx={{ width: "100%", display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
        <TextField fullWidth label="First Name" />
        <TextField fullWidth label="Last Name" />
        <TextField fullWidth label="ekds@gmailj.com" />
        <TextField fullWidth label="Mailing Address is filled" />
        <Autocomplete
          fullWidth
          renderInput={(params) => <TextField {...params} label="State" />}
          ListboxComponent={AutoCompleteListboxComponent}
          options={getAllStates()}
          onChange={() => {}}
        />

        <Autocomplete
          fullWidth
          renderInput={(params) => <TextField {...params} label="County" />}
          ListboxComponent={AutoCompleteListboxComponent}
          options={getAllStates()}
          onChange={() => {}}
        />
        <TextField
          label="Password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                  {showPassword ? <Eye /> : <EyeSlash />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Retype Password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                  {showPassword ? <Eye /> : <EyeSlash />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ width: "100%", gridColumn: { sm: "1/span 2" } }}>
          <FormControlLabel
            control={<Checkbox size="small" icon={<CheckboxIcon />} checkedIcon={<CheckboxCheckedIcon />} />}
            label="Send me emails with tips on how to find talent that fits my needs."
            slotProps={{ typography: { sx: { fontSize: 12, fontWeight: 500, color: "grey.800" } } }}
          />
          <FormControlLabel
            control={<Checkbox size="small" icon={<CheckboxIcon />} checkedIcon={<CheckboxCheckedIcon />} />}
            label={
              <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                Yes, I understand and agree to the Parcel Market{" "}
                <Typography component="span" sx={{ fontSize: 12, fontWeight: 500, color: "primary.main", textDecoration: "underline" }}>
                  Terms of Service
                </Typography>{" "}
                and{" "}
                <Typography component="span" sx={{ fontSize: 12, fontWeight: 500, color: "primary.main", textDecoration: "underline" }}>
                  Privacy Policy
                </Typography>
                .
              </Typography>
            }
            slotProps={{ typography: { sx: { fontSize: 12, fontWeight: 500, color: "grey.800" } } }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
          Already have an account?{" "}
          <Link href={routes.auth.signUp}>
            <Typography
              sx={{ fontSize: 14, fontWeight: 500, color: "primary.main", textDecoration: "underline", cursor: "pointer" }}
              component="span"
            >
              Sign In
            </Typography>
          </Link>
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexDirection: { xs: "column", md: "row" },
            width: { xs: "100%", md: "fit-content" },
          }}
        >
          <Button sx={{ width: { xs: "100%", md: "fit-content" } }} variant="outlined">
            Back
          </Button>
          <Button sx={{ width: { xs: "100%", md: "fit-content" } }} variant="contained">
            Create Account
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUpForm;
