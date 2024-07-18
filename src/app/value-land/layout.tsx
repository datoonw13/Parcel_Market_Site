import Divider from "@/components/@new/shared/Divider";
import ValueLanSidebar from "@/components/@new/value-land/value-land-sidebar";
import ValueLandStepper from "@/components/@new/value-land/value-land-stepper";
import { AppBarMini } from "@/components/app-bar";
import { MiniFooter } from "@/components/footer";
import { ReactNode } from "react";

const ValueLandLayout = ({ children }: { children: ReactNode }) => (
  <div className="h-screen grid grid-cols-1 xl:grid-cols-[1fr_400px] 2xl:grid-cols-[1fr_544px]">
    <div className="flex flex-col overflow-hidden">
      <div className="border-b border-b-grey-100 sm:border-none  py-4 mb-12 sm:py-0 sm:mb-10 sm:mt-10 md:mt-16">
        <div className="mx-5 sm:mx-7 md:mx-10 lg:mx-13 xl:mx-16">
          <AppBarMini />
        </div>
      </div>
      <div className="overflow-hidden grid border border-grey-100 md:border-none md:shadow-4 pt-6 rounded-2xl h-full mx-5 sm:mx-7 md:mx-10 lg:mx-13 xl:mx-16">
        <ValueLandStepper />
        {children}
      </div>
      <div className="mx-5 sm:mx-7 md:mx-10 lg:mx-13 xl:mx-16">
        <MiniFooter />
      </div>
    </div>
    <ValueLanSidebar />
  </div>
);

export default ValueLandLayout;
