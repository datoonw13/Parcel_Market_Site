// import LandingFeedBacks from "@/components/landing/LandingFeedBacks";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingMain from "@/components/landing/LandingMain";
// import LandingOffer from "@/components/landing/LandingOffer";
import LandingHeader from "@/components/landing/header/LandingHeader";

const Landing = () => (
  <>
    <section className="h-screen bg-neutral-400 grid" style={{ gridTemplateRows: "min-content 1fr" }}>
      <LandingHeader />
      <LandingMain />
    </section>
    {/* <section className="py-10 md:py-12 lg:py-16 xl:py-18 2xl:py-24">
      <LandingOffer />
    </section>
    <section>
      <LandingFeedBacks />
    </section> */}
    <section>
      <LandingFooter />
    </section>
  </>
);

export default Landing;
