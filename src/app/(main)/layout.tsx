import EventSourceWrapper from "@/components/@new/shared/event-source/event-source-wrapper";
import LandingFooter from "@/components/landing/footer";
import LandingHeader from "@/components/landing/header";
import { getUserAction } from "@/server-actions/user/actions";
import { ReactElement } from "react";

const MainLayout = async ({ children }: { children: ReactElement }) => {
  const user = await getUserAction();
  return (
    <>
      <div className="flex flex-col h-screen ">
        <EventSourceWrapper />
        <LandingHeader user={user} />
        <div className="flex flex-col h-full justify-between gap-11 sm:gap-12 md:gap-16 lg:gap-22 xl:gap-28 2xl:gap-32">
          <div>{children}</div>
          <LandingFooter className="mt-auto " />
        </div>
      </div>
    </>
  );
};
export default MainLayout;
