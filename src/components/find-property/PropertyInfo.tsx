"use client";

import { Info } from "@mui/icons-material";
import { Autocomplete, Box, Divider, FormControlLabel, Radio, RadioGroup, SxProps, TextField } from "@mui/material";
import React, { PropsWithChildren } from "react";
import { usaStatesFull } from "typed-usa-states";
import AutoCompleteListboxComponent from "../shared/AutoCompleteListboxComponent";

const getAllStates = () =>
  usaStatesFull
    .filter((el) => el.contiguous)
    .map((state) => ({ label: state.name, value: state.abbreviation.toLowerCase(), counties: state.counties }));

const Label = ({ label, sx }: { label: string; sx?: SxProps }) => (
  <Box sx={{ fontSize: 14, fontWeight: 500, color: "grey.800", display: "flex", alignItems: "center", gap: 1, ...sx }}>
    {label} <Info sx={{ color: "grey.200" }} fontSize="small" />
  </Box>
);

const PropertyInfo = () => (
  <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <Box
      sx={(theme) => ({
        border: { xs: `1px solid transparent`, md: `1px solid ${theme.palette.grey[100]}` },
        borderRadius: 4,
        p: { md: 3, lg: 4 },
        height: "100%",
      })}
    >
      <Box>
        <Label label="Search By" />
        <RadioGroup sx={{ display: "flex", flexDirection: "row", columnGap: 1, rowGap: 2, mt: 1.5 }}>
          <FormControlLabel
            value="parcelNumber"
            control={<Radio size="small" />}
            label={<Label label="Parcel Number" sx={{ fontSize: 16 }} />}
          />
          <FormControlLabel value="fullName" control={<Radio size="small" />} label={<Label label="Full Name" sx={{ fontSize: 16 }} />} />
          <FormControlLabel
            value="legalEntity"
            control={<Radio size="small" />}
            label={<Label label="Legal Entity" sx={{ fontSize: 16 }} />}
          />
        </RadioGroup>{" "}
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
        <TextField fullWidth label="Enter parcel ID" />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Autocomplete
            options={getAllStates()}
            fullWidth
            renderInput={(params) => <TextField {...params} label="Movie" />}
            ListboxComponent={AutoCompleteListboxComponent}
          />
          <Autocomplete
            options={getAllStates()}
            ListboxComponent={AutoCompleteListboxComponent}
            fullWidth
            renderInput={(params) => <TextField {...params} label="Movie" />}
          />
        </Box>
      </Box>
    </Box>
    <Divider sx={{ mt: 4 }} />
    <Box sx={{ mt: 2 }}>Footer</Box>
  </Box>
);

export default PropertyInfo;
