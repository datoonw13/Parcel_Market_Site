import Image from "next/image";
import Button from "../shared/Button";

const LandingMain = () => (
  <div className="flex flex-col md:flex-row justify-between md:items-center md:pb-20">
    <div className="px-[10px] md:px-[23px] lg:px-[43px] xl:px-[86px] 2xl:px-[112px] md:pr-0 flex flex-col gap-6 pt-14 md:pt-0">
      <h1 className="font-bricolage text-green-800 font-extrabold text-4xl lg:text-6xl 2xl:text-8xl  text-center md:text-start 2xl:w-[90%]">
        Value, buy, and sell vacant land
      </h1>
      <p className="hidden md:block text-2xl text-dark-green-500">Value your land for FREE in less than 3 minutes!</p>
      <Button classNames="py-6 md:hidden">Value My Land</Button>
      <Button classNames="hidden md:block py-6 h-[84px] w-fit">Get Started</Button>
    </div>
    <div className="relative w-full h-[100%] md:h-[70%] lg:h-[100%] overflow-hidden mt-10 md:mt-0">
      <Image alt="" src="/home-mobile.png" layout="fill" className="!left-4 md:hidden" />
      <Image alt="" src="/home.png" layout="fill" className="hidden md:block" />
    </div>
  </div>
);

export default LandingMain;
