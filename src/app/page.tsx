import Header from "@/components/header/Header";
import LandingMain from "@/components/landing/LandingMain";
import { Box } from "@mui/material";
import LandingSection1 from "@/components/landing/LandingSection1";
import LandingSection2 from "@/components/landing/LandingSection2";
import dynamic from "next/dynamic";
import LandingSection5 from "@/components/landing/LandingSection5";
import SubscribeNow from "@/components/landing/SubscribeNow";
import { Footer } from "@/components/footer";

const LandingSection3 = dynamic(() => import("../components/landing/LandingSection3"), { ssr: false });
const LandingSection4 = dynamic(() => import("../components/landing/LandingSection4"), { ssr: false });

const Landing = () => (
  <Box sx={{ display: "flex", flexDirection: "column" }}>
    <Header />
    <LandingMain />
    <Box sx={{ bgcolor: "white", py: { xs: 10, md: 11, lg: 12.5 } }}>
      <LandingSection1 />
    </Box>
    <Box sx={{ bgcolor: "white", py: { xs: 10, md: 11, lg: 12.5 } }}>
      <LandingSection2 />
    </Box>
    <Box sx={{ bgcolor: "grey.A100", py: { xs: 10, md: 11, lg: 12.5 } }}>
      <LandingSection3 />
    </Box>
    <Box sx={{ bgcolor: "white", py: { xs: 10, md: 11, lg: 12.5 } }}>
      <LandingSection4 />
    </Box>
    <Box sx={{ bgcolor: "white", py: { xs: 10, md: 11, lg: 12.5 } }}>
      <LandingSection5 />
    </Box>
    <SubscribeNow />
    <Box sx={{ bgcolor: "white", py: { xs: 10, md: 11, lg: 12.5 } }}>
      <Footer />
    </Box>
    <div />
  </Box>
);

export default Landing;
