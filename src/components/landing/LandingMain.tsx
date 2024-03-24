import Image from "next/image";
import Button from "../shared/Button";

const LandingMain = () => (
  <div className="flex flex-col justify-between">
    <div className="px-24 flex flex-col gap-6 pt-14">
      <h1 className="font-bricolage text-green-800 font-extrabold text-4xl text-center">Value, buy, and sell vacant land</h1>
      <Button classNames="py-6">Value My Land</Button>
    </div>
    <div className="relative w-full h-[100%] overflow-hidden mt-10">
      <Image alt="" src="/home-mobile.png" layout="fill" className="!left-4" />
    </div>
  </div>
);

export default LandingMain;
