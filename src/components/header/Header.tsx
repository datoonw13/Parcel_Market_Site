"use client";

import Logo from "@/icons/Logo";
import useAuthCheck from "@/hooks/useAuthCheck";
import DesktopNavigation from "./DesktopNavigation";
import MobileNav from "./MobileNav";
import Container from "../shared/Container";

const Header = () => {
  useAuthCheck();

  return (
    <div className="pt-10 md:pt-6 py-6 flex space-between gap-4 w-full items-center">
      <div className="min-w-[130px] w-[130px] xs:min-w-[145px] xs:w-[145px] lg:w-[180px] 2xl:w-[220px] h-[40px] lg:h-[60px] flex cursor-pointer">
        <Logo />
      </div>
      <DesktopNavigation />
      <MobileNav />
    </div>
  );
};

export default Header;
