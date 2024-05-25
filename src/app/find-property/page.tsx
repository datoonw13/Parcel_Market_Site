"use client";

import { Box, Divider, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import PropertyInfo from "@/components/find-property/PropertyInfo";
import FindPropertyStepper from "@/components/find-property/FindPropertyStepper";
import FindPropertyFoundedParcels from "@/components/find-property/FindPropertyFoundedParcels";
import FindPropertyAbout from "@/components/find-property/FindPropertyAbout";

enum Steps {
  PROPERTY_INFO,
  FOUNDED_PROPERTIES,
  ABOUT_PROPERTY,
  CALCULATED_PRICE,
}

const getStepInfo = (step: Steps) => {
  if (step === Steps.FOUNDED_PROPERTIES) {
    return {
      stepTitle: "Did we find your property?",
      stepDesc: "Select your property from the list below",
    };
  }
  if (step === Steps.ABOUT_PROPERTY) {
    return {
      stepTitle: "Tell us about your property",
      stepDesc:
        "Please provide us with a little information about the land. Parcel Market's unique algorithms use this information to give you the best valuation possible.",
    };
  }
  if (step === Steps.CALCULATED_PRICE) {
    return {
      stepTitle: "The average sale price for similar property in your area",
      stepDesc: "",
    };
  }
  return {
    stepTitle: "Property information",
    stepDesc: "Let’s find your property using some basic property information",
  };
};

const FindProperty = () => {
  const [step, setStep] = useState(Steps.PROPERTY_INFO);
  const { stepDesc, stepTitle } = getStepInfo(step);
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr" }, height: "100%" }}>
      <Paper sx={{ borderRadius: 4, py: 3, display: "flex", flexDirection: "column" }}>
        <FindPropertyStepper
          activeStep={step}
          steps={Object.keys(Steps)
            .map((x) => Number(x))
            .filter((el) => !Number.isNaN(el))}
        />
        <Divider sx={{ my: 3 }} />
        <Box sx={{ px: { xs: 2, md: 3, lg: 4 } }}>
          {stepTitle && (
            <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, sm: 20, md: 22, lg: 24 }, mb: 1.5 }}>{stepTitle}</Typography>
          )}
          {stepDesc && <Typography sx={{ fontWeight: 500, fontSize: { xs: 14, md: 16 }, color: "grey.800" }}>{stepDesc}</Typography>}
        </Box>
        <Box sx={{ mt: 3, height: "100%" }}>
          {/* {step === Steps.PROPERTY_INFO && <PropertyInfo />} */}
          {/* <FindPropertyFoundedParcels /> */}
          <FindPropertyAbout />
        </Box>
      </Paper>
    </Box>
  );
};
export default FindProperty;
