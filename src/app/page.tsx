import Header from "@/components/header/Header";
import LandingMain from "@/components/landing/LandingMain";
import { Box } from "@mui/material";
import LandingSection1 from "@/components/landing/LandingSection1";
import LandingSection2 from "@/components/landing/LandingSection2";
import dynamic from "next/dynamic";

const LandingSection3 = dynamic(() => import("../components/landing/LandingSection3"), { ssr: false });

const Landing = () => (
  <Box sx={{ display: "flex", flexDirection: "column" }}>
    <Box sx={{ bgcolor: "white", py: { xs: 10, md: 11, lg: 12.5 } }}>
      <Header />
      <LandingMain />
    </Box>
    <Box sx={{ bgcolor: "white", py: { xs: 10, md: 11, lg: 12.5 } }}>
      <LandingSection1 />
    </Box>
    <Box sx={{ bgcolor: "white", py: { xs: 10, md: 11, lg: 12.5 } }}>
      <LandingSection2 />
    </Box>
    <Box sx={{ bgcolor: "grey.A100", py: { xs: 10, md: 11, lg: 12.5 } }}>
      <LandingSection3 />
    </Box>
    <div />
  </Box>
);

export default Landing;
