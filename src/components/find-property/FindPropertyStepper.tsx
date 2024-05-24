import { DoneOutlined } from "@mui/icons-material";
import { Box, Step, Stepper } from "@mui/material";
import React from "react";

const FindPropertyStepper = ({ steps, activeStep }: { steps: number[]; activeStep: number }) => (
  <Stepper activeStep={1} sx={{ px: { xs: 2, md: 3, lg: 4 } }}>
    {steps.map((key) => (
      <Step
        key={key}
        sx={(theme) => ({
          p: 0,
        })}
      >
        {Number(key) < activeStep && (
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
        {Number(key) === activeStep && (
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
            {Number(key) + 1}
          </Box>
        )}
        {Number(key) > activeStep && (
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
            {Number(key) + 1}
          </Box>
        )}
      </Step>
    ))}
  </Stepper>
);

export default FindPropertyStepper;
