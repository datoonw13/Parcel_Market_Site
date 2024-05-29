import SignUpForm from "@/components/sign-up/SignUpForm";
import SignUpSelectRole from "@/components/sign-up/SignUpSelectRole";
import { Box } from "@mui/material";
import React from "react";

const page = () => (
  <Box sx={{ height: "100%" }}>
    {/* <SignUpSelectRole /> */}
    <SignUpForm />
  </Box>
);

export default page;
