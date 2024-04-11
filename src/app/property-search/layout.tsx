import LogoHeader from "@/components/shared/LogoHeader";
import Image from "next/image";
import { ReactNode } from "react";

const PropertySearchLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => (
  <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr] lg:grid-cols-[2fr_1fr] h-full">
    <div className="relative">
      <LogoHeader classNames="md:bg-white md:!justify-start px-4 md:px-8 lg:px-12 lx:px-16 2xl:px-20" />
      {children}
    </div>
    <div className="flex-col hidden md:flex">
      <LogoHeader hideLogo />
      <div className="relative w-full h-full bg-neutral ">
        <Image alt="" src="/right-banner.png" fill />
      </div>
    </div>
  </div>
);

export default PropertySearchLayout;
