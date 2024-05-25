import { Box, Button, Checkbox, Divider, FormControlLabel, TextField, Typography } from "@mui/material";
import React from "react";

const FindPropertyAbout = () => (
  <Box sx={{ height: "100%", display: "flex", flexDirection: "column", mt: { xs: 1, md: 0 } }}>
    <Box sx={{ px: { xs: 2, md: 3, lg: 4, mb: 3 }, height: "100%" }}>
      <Box
        sx={(theme) => ({
          border: { xs: `1px solid transparent`, md: `1px solid ${theme.palette.grey[100]}` },
          borderRadius: 4,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: { xs: 4 },
          py: { md: 3, lg: 4 },
        })}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 4 }, px: { md: 4, lg: 5 } }}>
          {list.map((el, i) => (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }} key={el.key}>
              <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{`${i + 1}. ${el.label}`}</Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {el.options.map((opt) => (
                  <Box
                    key={opt.label}
                    sx={(theme) => ({
                      border: `1px solid ${theme.palette.grey[100]}`,
                      borderRadius: "100px",
                      fontSize: 12,
                      fontWeight: 500,
                      px: 2,
                      py: 1,
                    })}
                  >
                    {opt.label}
                  </Box>
                ))}
                {/* <Box
                sx={(theme) => ({
                  border: `1px solid ${theme.palette.green["200"]}`,
                  color: "primary.main",
                  borderRadius: "100px",
                  bgcolor: "green.100",
                  fontSize: 12,
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                })}
              >
                No
              </Box> */}
              </Box>
            </Box>
          ))}
        </Box>
        <Divider />
        <Box sx={{ px: { md: 4, lg: 5 } }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
            Please estimate a value for any improvements. Sheds, Barns, Well installed, etc.
          </Typography>
          <TextField variant="outlined" fullWidth sx={{ mt: 2, border: 0, outline: 0 }} InputProps={{ sx: { border: 0, outline: 0 } }} />
        </Box>
      </Box>
    </Box>
    <FormControlLabel
      sx={{ px: { md: 4, lg: 5 }, mt: 2 }}
      control={<Checkbox />}
      label={
        <Typography sx={{ fontSize: 12 }}>
          Yes, I understand and agree to the Parcel Market{" "}
          <Typography component="span" sx={{ color: "primary.main", textDecoration: "underline", fontSize: 12 }}>
            Terms of Service
          </Typography>{" "}
          and{" "}
          <Typography component="span" sx={{ color: "primary.main", textDecoration: "underline", fontSize: 12 }}>
            Privacy Policy
          </Typography>
          .
        </Typography>
      }
    />
    <Divider sx={{ mt: 4 }} />
    <Box
      sx={{
        mt: 2,
        px: { xs: 2, md: 3, lg: 4, mb: 3 },
        display: "flex",
        justifyContent: "flex-end",
        gap: 1.5,
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      <Button sx={{ width: { xs: "100%", sm: "fit-content" } }} variant="outlined">
        Back
      </Button>
      <Button sx={{ width: { xs: "100%", sm: "fit-content" } }} variant="contained">
        Find out Your Estimated Sale Price
      </Button>
    </Box>
  </Box>
);

export default FindPropertyAbout;

const list = [
  {
    label: "Does your property have a water feature such as a lake or stream?",
    key: "about.waterFeature",
    options: [
      {
        label: "NO",
        value: false,
      },
      {
        label: "Yes",
        value: true,
      },
    ],
  },
  {
    label: "Is your property water front?",
    key: "about.waterFront",
    options: [
      {
        label: "NO",
        value: false,
      },
      {
        label: "Yes",
        value: true,
      },
    ],
  },
  {
    label: "What is your land cover type?",
    key: "about.langCoverType",
    options: [
      {
        label: "Wooded",
        value: "Wooded",
      },
      {
        label: "Open Field",
        value: "Open Field",
      },
      {
        label: "Mixed",
        value: "Mixed",
      },
    ],
  },
  {
    label: "What is the property condition?",
    key: "about.propertyCondition",
    options: [
      {
        label: "Clean and Ready to build on",
        value: "Clean and Ready to build on",
      },
      {
        label: "Needs some site work",
        value: "Needs some site work",
      },
      {
        label: "Needs Extensive site work",
        value: "Needs Extensive site work",
      },
    ],
  },
  {
    label: "How wet is the property?",
    key: "about.wetProperty",
    options: [
      {
        label: "Wet",
        value: "Wet",
      },
      {
        label: "Some portions wet",
        value: "Some portions wet",
      },
      {
        label: "Not wet",
        value: "Not wet",
      },
    ],
  },
  {
    label: "Property have Restrictions?",
    key: "about.propertyRestriction",
    options: [
      {
        label: "Has restrictions",
        value: "Has restrictions",
      },
      {
        label: "No restrictions",
        value: "No restrictions",
      },
    ],
  },
  {
    label: "How is the access to the property?",
    key: "about.propertyAccess",
    options: [
      {
        label: "Road frontage",
        value: "Road frontage",
      },
      {
        label: "Legal easement",
        value: "Legal easement",
      },
      {
        label: "Non-recorded easement",
        value: "Non-recorded easement",
      },
      {
        label: "No legal access",
        value: "No legal access",
      },
    ],
  },
];
