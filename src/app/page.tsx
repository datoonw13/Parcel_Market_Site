// import LandingFeedBacks from "@/components/landing/LandingFeedBacks";
import Header from "@/components/header/Header";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingMain from "@/components/landing/LandingMain";
// import LandingOffer from "@/components/landing/LandingOffer";

const Landing = () => (
  <>
    <section className="h-screen bg-neutral-400 grid" style={{ gridTemplateRows: "min-content 1fr" }}>
      <Header />
      <LandingMain />
    </section>
    <section>
      <LandingFooter />
    </section>
    {/* <section className="py-10 md:py-12 lg:py-16 xl:py-18 2xl:py-24">
      <LandingOffer />
    </section>
    <section>
      <LandingFeedBacks />
    </section> */}
  </>
);

export default Landing;
