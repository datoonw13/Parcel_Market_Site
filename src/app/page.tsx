import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import LandingMain from "@/components/landing/LandingMain";
import Container from "@/components/shared/Container";
import { Button, Typography } from "@mui/material";

const Landing = () => (
  <>
    <section className="h-screen bg-neutral-400 grid" style={{ gridTemplateRows: "min-content 1fr" }}>
      <Typography>aee</Typography>
      <Button variant="contained" color="darkGreen">
        avoiee
      </Button>
      <Container>
        <Header />
      </Container>
      <LandingMain />
    </section>
    <section>
      <Footer />
    </section>
  </>
);

export default Landing;
