import { AppBarMini } from "@/components/app-bar";
import { MiniFooter } from "@/components/footer";
import { ReactNode } from "react";

const MiniLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col min-h-screen justify-between h-full bg-grey-30">
    <div>
      <AppBarMini />
    </div>
    <div>{children}</div>
    <div>
      <MiniFooter />
    </div>
  </div>
);

export default MiniLayout;
