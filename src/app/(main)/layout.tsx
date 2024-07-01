import { AppBar } from "@/components/app-bar";
import { Footer } from "@/components/footer";
import SubscribeNow from "@/components/shared/SubscribeNow";
import { ReactElement } from "react";

const MainLayout = ({ children }: { children: ReactElement }) => (
  <div className="flex flex-col">
    <AppBar />
    {children}
    <SubscribeNow />
    <div className="bg-white py-20 md:py-20.5">
      <Footer />
    </div>
  </div>
);
export default MainLayout;
