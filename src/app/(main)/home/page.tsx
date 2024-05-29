import LandingMain from "@/components/home/HomeMain";
import { Box } from "@mui/material";
import LandingSection1 from "@/components/home/HomeSection1";
import LandingSection2 from "@/components/home/HomeSection2";
import dynamic from "next/dynamic";
import LandingSection5 from "@/components/home/HomeSection5";

const LandingSection3 = dynamic(() => import("../../../components/home/HomeSection3"), { ssr: false });
const LandingSection4 = dynamic(() => import("../../../components/home/HomeSection4"), { ssr: false });

const Home = () => (
  <>
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
  </>
);

export default Home;
