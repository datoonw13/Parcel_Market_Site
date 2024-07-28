import { AppBarMini } from "@/components/app-bar";
import { MiniFooter } from "@/components/footer";
import clsx from "clsx";
import { ReactNode } from "react";
import Container from "./Container";

const MiniLayout = ({ children, rootClasses, contentClasses }: { children: ReactNode; rootClasses?: string; contentClasses?: string }) => (
  <div className={clsx("flex flex-col justify-between bg-white sm:bg-grey-30", rootClasses, "space-y-8")}>
    <AppBarMini />
    <Container className={contentClasses}>{children}</Container>
    <Container maxWidth="max-w-full" className="pb-4 sm:pb-5 md:pb-6 lg:pb-[30px]">
      <MiniFooter />
    </Container>
  </div>
);

export default MiniLayout;
