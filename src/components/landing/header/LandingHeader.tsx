import Logo from "@/icons/Logo";
import LandingNavigation from "./LandingNavigation";

const LandingHeader = () => {
  console.log("header");

  return (
    <div className="px-[100px] py-6 flex space-between gap-4 w-full">
      <div className="w-[220px] h-[60px] flex">
        <Logo />
      </div>
      <LandingNavigation />
    </div>
  );
};

export default LandingHeader;
