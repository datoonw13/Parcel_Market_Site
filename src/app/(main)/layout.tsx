import Container from "@/components/@new/shared/Container";
import Divider from "@/components/@new/shared/Divider";
import EventSourceWrapper from "@/components/@new/shared/event-source/event-source-wrapper";
// import { AppBar } from "@/components/app-bar";
import { Footer, MiniFooter } from "@/components/footer";
import SubscribeNow from "@/components/shared/SubscribeNow";
import { ReactElement } from "react";

const MainLayout = ({ children }: { children: ReactElement }) => (
  <>
    <EventSourceWrapper />
    <div className="flex flex-col">
      {/* <AppBar /> */}
      {children}
      <SubscribeNow />
      <Footer />
      <Container className="mt-6">
        <Divider />
        <div className="py-6">
          <MiniFooter />
        </div>
      </Container>
    </div>
  </>
);
export default MainLayout;
