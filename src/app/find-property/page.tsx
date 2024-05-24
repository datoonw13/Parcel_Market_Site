"use client";

import { Box, Divider, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";
import React, { ReactNode, useState } from "react";
import { CheckCircleOutlineOutlined, DoneOutlined } from "@mui/icons-material";

enum Steps {
  PROPERTY_INFO,
  FOUNDED_PROPERTIES,
  ABOUT_PROPERTY,
  CALCULATED_PRICE,
}

const FindProperty = () => {
  const [step, setStep] = useState(Steps.PROPERTY_INFO);
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr" }, height: "100%", p: 10 }}>
      <Paper sx={{ borderRadius: 4, py: 3 }}>
        <Stepper activeStep={1} sx={{ px: { xs: 2, md: 3, lg: 4 } }}>
          {Object.values(Steps)
            .filter((el) => !Number.isNaN(Number(el)))
            .map((key) => (
              <Step
                key={key}
                sx={(theme) => ({
                  p: 0,
                })}
              >
                {Number(key) < step && (
                  <Box
                    sx={(theme) => ({
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor: "success.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    })}
                  >
                    <DoneOutlined sx={{ color: "white" }} />
                  </Box>
                )}
                {Number(key) === step && (
                  <Box
                    sx={(theme) => ({
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      border: `1px solid ${theme.palette.success.main}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 500,
                    })}
                  >
                    1
                  </Box>
                )}
                {Number(key) > step && (
                  <Box
                    sx={(theme) => ({
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      border: `1px solid ${theme.palette.divider}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 500,
                    })}
                  >
                    1
                  </Box>
                )}
              </Step>
            ))}
        </Stepper>
        <Divider sx={{ my: 3 }} />
        <Box sx={{ px: { xs: 2, md: 3, lg: 4, mb: 3 } }}>
          <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, sm: 20, md: 22, lg: 24 }, mb: 1.5 }}>
            Did we find your property?
          </Typography>
          <Typography sx={{ fontWeight: 500, fontSize: { xs: 14, md: 16 }, color: "grey.800" }}>
            Select your property from the list below
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
export default FindProperty;
