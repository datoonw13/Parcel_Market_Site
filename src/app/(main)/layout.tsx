import EventSourceWrapper from "@/components/@new/shared/event-source/event-source-wrapper";
import { AppBar } from "@/components/app-bar";
import { Footer } from "@/components/footer";
import SubscribeNow from "@/components/shared/SubscribeNow";
import { ReactElement } from "react";

const MainLayout = ({ children }: { children: ReactElement }) => (
  <>
    <EventSourceWrapper />
    <div className="flex flex-col">
      <AppBar />
      {children}
      <SubscribeNow />
      <Footer />
    </div>
  </>
);
export default MainLayout;
