import LogoHeader from "@/components/shared/LogoHeader";
import ProgressBar from "@/components/shared/ProgressBar";
import Image from "next/image";
import { ReactNode } from "react";

const FindPropertyLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => (
  <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr] lg:grid-cols-[2fr_1fr] h-full">
    <div>
      <LogoHeader classNames="md:bg-white md:!justify-start px-4 md:px-8 lg:px-12 lx:px-16 2xl:px-20" />
      <div className="px-4 md:px-8 lg:px-12 lx:px-16 2xl:px-20 py-10 flex flex-col gap-10">
        <ProgressBar currentStep={1} totalSteps={4} goBack={() => {}} />
        <div>
          <h1 className="text-dark-green font-bricolage font-bold text-2xl mb-6">Property information</h1>
          <h2 className="text-dark-green-500 font-medium text-xl">Let’s find your property using some basic property information</h2>
        </div>
        {children}
      </div>
    </div>
    <div className="flex-col hidden md:flex">
      <LogoHeader hideLogo />
      <div className="relative w-full h-full bg-neutral ">
        <Image alt="" src="/right-banner.png" fill />
      </div>
    </div>
  </div>
);

export default FindPropertyLayout;
