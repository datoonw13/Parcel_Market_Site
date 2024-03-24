import Logo from "@/icons/Logo";
import LandingDesktopNavigation from "./LandingDesktopNavigation";
import LandingMobileNav from "./LandingMobileNav";

const LandingHeader = () => (
  <div className="px-[10px] md:px-[20px] lg:px-[40px] xl:px-[80px] 2xl:px-[100px] pt-10 md:pt-6 py-6 flex space-between gap-4 w-full items-center">
    <div className="min-w-[145px] w-[145px] lg:w-[180px] 2xl:w-[220px] h-[40px] lg:h-[60px] flex cursor-pointer">
      <Logo />
    </div>
    <LandingDesktopNavigation />
    <LandingMobileNav />
  </div>
);

export default LandingHeader;
