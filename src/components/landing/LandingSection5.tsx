"use client";

import { Accordion, AccordionDetails, AccordionSummary, Box, Container, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const LandingSection5 = () => (
  <Container
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: { xs: 4, md: 5, lg: 6 },
    }}
  >
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography sx={{ fontSize: 16, textAlign: "center", mb: 0.5, color: "primary.main" }}>FAQ</Typography>
      <Typography sx={{ fontSize: { xs: 24, sm: 28, md: 32, lg: 36 }, textAlign: "center", fontWeight: 600 }}>
        Frequently asked questions
      </Typography>
    </Box>
    <Box sx={(theme) => ({ border: `1px solid ${theme.palette.grey[200]}`, p: { xs: 3, md: 4.5 }, borderRadius: 2 })}>
      {qa.map((el) => (
        <Accordion
          key={el.title}
          sx={(theme) => ({
            boxShadow: "0",
            borderRadius: "0 !important",
            p: 0,
            border: 0,
            py: 1,
          })}
        >
          <AccordionSummary
            sx={{ p: 0, fontSize: 16, fontWeight: 500 }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            {el.title}
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0, fontSize: 14, color: "grey.600" }}>{el.desc}</AccordionDetails>
        </Accordion>
      ))}
    </Box>
  </Container>
);

export default LandingSection5;

const qa = new Array(6).fill(0).map((_, i) => ({
  title: `Frequently asked question ${i + 1}`,
  desc: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
}));
