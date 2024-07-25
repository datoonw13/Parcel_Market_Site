import { AppBarMini } from "@/components/app-bar";
import { MiniFooter } from "@/components/footer";
import { ReactNode } from "react";

const MiniLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col min-h-screen h-full bg-grey-30">
    <div className="border-b border-b-grey-100 sm:border-none  py-4 mb-12 sm:py-0 sm:mb-10 sm:mt-10 md:mt-16">
      <div className="mx-5 sm:mx-7 md:mx-10 lg:mx-13 xl:mx-16">
        <AppBarMini />
      </div>
    </div>
    <div className="flex flex-col justify-between h-full mx-5 sm:mx-7 md:mx-10 lg:mx-13 xl:mx-16">{children}</div>
    <div className="mx-5 sm:mx-7 md:mx-10 lg:mx-13 xl:mx-16">
      <MiniFooter />
    </div>
  </div>
);

export default MiniLayout;
