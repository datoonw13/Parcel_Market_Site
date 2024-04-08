import IntegrationIcon from "@/icons/IntegrationIcon";
import { ReactNode } from "react";
import UsdLandingIcon from "@/icons/UsdLandingIcon";
import SearchLandingIcon from "@/icons/SearchLandingIcon";
import Button from "../shared/Button";

const RenderOfferBox = ({ icon, title, desc, buttonLabel }: { icon: ReactNode; title: string; desc: string; buttonLabel: string }) => (
  <div className="bg-neutral-400 hover:bg-neutral transition-all px-6 pt-6 pb-8 w-full h-[355px] xs:h-[312px] lg:h-[355px] xl:h-[312px] rounded-3xl cursor-pointer flex flex-col justify-between align-center">
    <div>
      <div className="w-[46px] m-auto lg:m-0">{icon}</div>
      <p className="mt-12 mb-1 text-xl text-green-900 font-bold text-center lg:text-start">{title}</p>
      <p className="text-dark-green mb-4 text-center lg:text-start">{desc}</p>
    </div>
    <Button classNames="md:w-fit m-auto lg:m-0">{buttonLabel}</Button>
  </div>
);

const LandingOffer = () => (
  <div className="flex flex-col items-center px-8 lg:px-10 lg:px-12 xl:px-14 2xl:px-[120px] ">
    <h2 className="text-green text-lg md:text-xl lg:text-2xl font-bold">OUR OFFER</h2>
    <h1 className="text-dark-green font-semibold text-4xl lg:text-5xl mt-6 mb-11 md:mb-12 lg:mb-14 xl:mb-16 text-center">
      Connect to your favourite tools
    </h1>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-sm md:max-w-none w-full">
      <RenderOfferBox
        title="See your property’s value"
        desc="Find out what your property is worth using sale data from across the web."
        icon={<IntegrationIcon />}
        buttonLabel="Valuate your property"
      />
      <RenderOfferBox
        title="Sell fast without hassle"
        desc="Sell your property to an investor, eliminating the hassle of conventionall real estate sales."
        icon={<UsdLandingIcon />}
        buttonLabel="Sell your property now"
      />
      <RenderOfferBox
        title="Discover your next Land Deal"
        desc="See current listings that match your search criteria to find your next home."
        icon={<SearchLandingIcon />}
        buttonLabel="Explore The Parcel Market"
      />
    </div>
  </div>
);

export default LandingOffer;
