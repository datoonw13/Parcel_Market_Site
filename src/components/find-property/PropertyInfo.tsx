"use client";

import { Box, Divider } from "@mui/material";
import React from "react";

const PropertyInfo = () => (
  <Box>
    <Box
      sx={(theme) => ({
        border: { xs: `1px solid transparent`, md: `1px solid ${theme.palette.grey[100]}` },
        borderRadius: 4,
        p: { md: 3, lg: 4 },
      })}
    >
      Content
    </Box>
    <Divider sx={{ mt: 4 }} />
    <Box sx={{ mt: 2 }}>Footer</Box>
  </Box>
);

export default PropertyInfo;
