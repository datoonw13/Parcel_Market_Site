import { AppBarMini } from "@/components/app-bar";
import { MiniFooter } from "@/components/footer";
import clsx from "clsx";
import { ReactNode } from "react";
import Container from "./Container";

const MiniLayout = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={clsx("flex flex-col justify-between min-h-screen bg-white sm:bg-grey-30", className, "space-y-16")}>
    <AppBarMini />
    <Container>{children}</Container>
    <Container maxWidth="max-w-full" className="pb-4 sm:pb-5 md:pb-6 lg:pb-[30px]">
      <MiniFooter />
    </Container>
  </div>
);

export default MiniLayout;
