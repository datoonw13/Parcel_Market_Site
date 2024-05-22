import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import LandingMain from "@/components/landing/LandingMain";
import Container from "@/components/shared/Container";
import { Box, Button, Typography } from "@mui/material";
import LandingSection1 from "@/components/landing/LandingSection1";

const Landing = () => (
  <>
    <Box sx={{ bgcolor: "white" }}>
      <Header />
      <LandingMain />
    </Box>
    <LandingSection1 />
  </>
);

export default Landing;
