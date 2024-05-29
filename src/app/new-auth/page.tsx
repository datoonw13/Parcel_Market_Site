import GoogleIcon from "@/icons/GoogleIcon";
import { Box, Button, Checkbox, Divider, FormControlLabel, TextField, Typography } from "@mui/material";
import React from "react";

const NewAuth = () => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center", height: "100%", maxWidth: 296, m: "auto" }}>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Typography variant="h1" sx={{ textAlign: "center", fontSize: { xs: 24, sm: 28, md: 32, lg: 36 }, fontWeight: 600 }}>
        Sign In
      </Typography>
      {/* <Typography sx={{ textAlign: "center", fontWeight: 500, fontSize: { xs: 14, md: 16 }, color: "grey.800" }}>
        Creating account for a{" "}
        <Typography sx={{ textAlign: "center", fontWeight: 500, fontSize: { xs: 14, md: 16 }, color: "primary.main" }} component="span">
          Real Estate Professional
        </Typography>
      </Typography> */}
    </Box>

    <Box sx={{ width: "100%", display: "grid", gridTemplateColumns: { xs: "1fr" }, gap: 2 }}>
      <TextField variant="outlined" label="Email" />
      <TextField label="Password" />
      <FormControlLabel
        control={<Checkbox />}
        label="Remember me"
        // slotProps={{ typography: { sx: { fontSize: 12, fontWeight: 500, color: "grey.800" } } }}
      />
    </Box>
    <Button variant="contained" fullWidth>
      Sign In
    </Button>
    <Divider>OR</Divider>
    <Box
      sx={{
        "& svg": { width: 24, height: 24 },
        display: "flex",
        gap: 2,
        boxShadow: "0px 2px 3px 0px rgba(0, 0, 0, 0.168)",
        borderRadius: 10,
        py: 1.5,
        width: "100%",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <GoogleIcon />
      <Typography sx={{ fontWeight: 500, fontSize: 16, opacity: 0.56 }}>Continue with Google</Typography>
    </Box>
    <Typography sx={{ fontSize: 14, fontWeight: 500, mt: "auto" }}>
      Don&apos;t have an account?{" "}
      <Typography
        sx={{ fontSize: 14, fontWeight: 500, color: "primary.main", textDecoration: "underline", cursor: "pointer" }}
        component="span"
      >
        Sign Up{" "}
      </Typography>
    </Typography>
  </Box>
);

export default NewAuth;
