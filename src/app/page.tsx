import LandingMain from "@/components/landing/LandingMain";
import LandingHeader from "@/components/landing/header/LandingHeader";

const Landing = () => (
  <>
    <section className="h-screen bg-neutral-400 grid" style={{ gridTemplateRows: "min-content 1fr" }}>
      <LandingHeader />
      <LandingMain />
    </section>
    <section className="py-20 bg-green-400 relative">asas</section>
  </>
);

export default Landing;
