"use client";

import AutoCompleteListboxComponent from "@/components/shared/AutoCompleteListboxComponent";
import { Info } from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  SxProps,
  TextField,
  Tooltip,
} from "@mui/material";
import React from "react";

const Label = ({ label, info, sx }: { label: string; info?: string; sx?: SxProps }) => (
  <Box sx={{ fontSize: 16, fontWeight: 500, display: "flex", alignItems: "center", gap: 1, ...sx }}>
    {label}
    <Tooltip title={info} arrow slotProps={{ arrow: { sx: { color: "black" } }, tooltip: { sx: { bgcolor: "black" } } }}>
      <Info sx={{ color: "grey.200" }} fontSize="small" />
    </Tooltip>
  </Box>
);

const Offer = () => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Label
        label="Offer Price"
        info="This is the land's unique number assigned by the county and is the best way to locate your property."
      />
      <TextField placeholder="Your price" />
    </Box>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Label
        label="Earnest money"
        info="This is the land's unique number assigned by the county and is the best way to locate your property."
      />
      <RadioGroup>
        <FormControlLabel value="0" control={<Radio />} label="None" />
        <FormControlLabel value="5" control={<Radio />} label="5%" />
        <FormControlLabel value="10" control={<Radio />} label="10%" />
        <FormControlLabel value="20" control={<Radio />} label="20%" />
        <FormControlLabel value="custom" control={<Radio />} label="Custom" />
        <TextField placeholder="Type here" sx={{ mt: 1.5 }} />
      </RadioGroup>
    </Box>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Label
        label="Inspection Period"
        info="This is the land's unique number assigned by the county and is the best way to locate your property."
      />
      <RadioGroup>
        <FormControlLabel value="0" control={<Radio />} label="None" />
        <FormControlLabel value="10" control={<Radio />} label="10 Days" />
        <FormControlLabel value="20" control={<Radio />} label="20 Days" />
        <FormControlLabel value="30" control={<Radio />} label="30 Days" />
      </RadioGroup>
    </Box>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Label
        label="Closing Period"
        info="This is the land's unique number assigned by the county and is the best way to locate your property."
      />
      <RadioGroup>
        <FormControlLabel value="15" control={<Radio />} label="15 Days" />
        <FormControlLabel value="30" control={<Radio />} label="30 Days" />
        <FormControlLabel value="45" control={<Radio />} label="45 Days" />
      </RadioGroup>
    </Box>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Label
        label="Closing Costs"
        info="This is the land's unique number assigned by the county and is the best way to locate your property."
      />
      <RadioGroup>
        <FormControlLabel value="sellerPays" control={<Radio />} label="Seller Pays" />
        <FormControlLabel value="splitEqually" control={<Radio />} label="Split Equally" />
        <FormControlLabel value="buyerPays" control={<Radio />} label="Buyer Pays" />
      </RadioGroup>
    </Box>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Label
        label="Contingencies"
        info="This is the land's unique number assigned by the county and is the best way to locate your property."
      />
      <RadioGroup>
        <FormControlLabel value="none" control={<Checkbox />} label="None" />
        <FormControlLabel value="title" control={<Checkbox />} label="Title" />
        <FormControlLabel value="Financing" control={<Checkbox />} label="Financing" />
        <FormControlLabel value="Appraisal" control={<Checkbox />} label="Appraisal" />
        <FormControlLabel value="Other" control={<Checkbox />} label="Other" />
        <TextField placeholder="Type here" sx={{ mt: 1.5 }} />
      </RadioGroup>
    </Box>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Label
        label="Offer Active until"
        info="This is the land's unique number assigned by the county and is the best way to locate your property."
      />
      <Autocomplete
        fullWidth
        renderInput={(params) => <TextField {...params} label="Offer Active" />}
        ListboxComponent={AutoCompleteListboxComponent}
        onChange={(_, newValue) => {}}
        options={[1, 2, 3, 4, 5]}
        getOptionLabel={(el) => `${el} Days`}
      />
    </Box>
    <Alert severity="info" onClose={() => {}}>
      <AlertTitle>Check your information</AlertTitle>
      Please check your information one more time, before you submit. You won’t be able to edit, or send offer again, but you can contact to
      the seller and manage changes.
    </Alert>
  </Box>
);

export default Offer;
