import Image from "next/image";
import Link from "next/link";
import routes from "@/helpers/routes";
import Button from "../shared/Button";

const LandingMain = () => (
  <div className="flex flex-col lg:flex-row justify-between lg:items-center lg:pb-20">
    <div
      className="
      px-[10px] lg:pr-0 lg:pl-[20px] lg:pl-[40px] xl:pl-[80px] 2xl:pl-[100px] flex flex-col gap-6 pt-14 lg:pt-0 
      w-[60%] md:w-[100%] 2xl:w-[80%]  m-auto"
    >
      <h1 className="font-bricolage text-green-800 font-extrabold text-4xl lg:text-6xl 2xl:text-8xl  text-center lg:text-start">
        Value, buy, and sell vacant land
      </h1>
      <p className="hidden sm:block text-xl md:text-2xl text-dark-green-500 text-center lg:text-start">
        Value your land for FREE in less than 3 minutes!
      </p>
      <Link href={routes.propertySearch.root}>
        <Button classNames="py-6 lg:hidden max-w-[500px] w-full m-auto">Value My Land</Button>
      </Link>
      <Link href={routes.propertySearch.root}>
        <Button classNames="hidden lg:block py-6 h-[84px] w-fit">Get Started</Button>
      </Link>
    </div>
    <div className="relative w-full h-[100%] lg:h-[80%] xl:h-[90%] 2xl:h-[100%] overflow-hidden mt-10 lg:mt-0">
      <Image alt="" src="/home-mobile.png" fill className="!left-4 lg:hidden" />
      <Image alt="" src="/home.png" fill className="hidden lg:block" />
    </div>
  </div>
);

export default LandingMain;
