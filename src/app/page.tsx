import Header from "@/components/header/Header";
import LandingMain from "@/components/landing/LandingMain";
import { Box } from "@mui/material";
import LandingSection1 from "@/components/landing/LandingSection1";

const Landing = () => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 10, md: 11, lg: 12.5 } }}>
    <Box sx={{ bgcolor: "white" }}>
      <Header />
      <LandingMain />
    </Box>
    <LandingSection1 />
  </Box>
);

export default Landing;
