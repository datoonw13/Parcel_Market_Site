import { AppBarMini } from "@/components/app-bar";
import { MiniFooter } from "@/components/footer";
import clsx from "clsx";
import { ReactNode } from "react";
import Container from "./Container";

const MiniLayout = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={clsx("flex flex-col min-h-screen justify-between h-full", className)}>
    <AppBarMini />
    <div>{children}</div>
    <Container maxWidth="max-w-full" className="pt-8 pb-4 sm:pb-5 md:pb-6 lg:pb-[30px]">
      <MiniFooter />
    </Container>
  </div>
);

export default MiniLayout;
