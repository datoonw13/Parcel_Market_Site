import ValueLanSidebar from "@/components/@new/value-land/value-land-sidebar";
import { AppBarMini } from "@/components/app-bar";
import { MiniFooter } from "@/components/footer";
import { ReactNode } from "react";
import ValueLandCheckData from "@/components/@new/value-land/check-data";
import { getUserAction } from "@/server-actions/user/actions";
import MiniLayout from "@/components/@new/shared/mini-layout";

const ValueLandLayout = async ({ children }: { children: ReactNode }) => {
  const user = await getUserAction();
  return (
    <>
      <ValueLandCheckData />
      <div className="h-screen grid grid-cols-1 xl:grid-cols-[1fr_400px] 2xl:grid-cols-[1fr_544px]">
        <MiniLayout contentClasses="h-full" rootClasses="!min-h-full1">
          <div className="bg-white h-full rounded-2xl border border-grey-100 md:border-0">{children}</div>
        </MiniLayout>
        <ValueLanSidebar user={user} />
      </div>
    </>
  );
};

export default ValueLandLayout;
