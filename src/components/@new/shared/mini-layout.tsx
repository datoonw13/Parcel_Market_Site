// import { AppBarMini } from "@/components/app-bar";
import { MiniFooter } from "@/components/footer";
import clsx from "clsx";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Container from "./Container";
import HeaderMini from "./header-mini";

const MiniLayout = ({ children, rootClasses, contentClasses }: { children: ReactNode; rootClasses?: string; contentClasses?: string }) => (
  <div className={clsx("flex flex-col justify-between bg-white sm:bg-grey-30", rootClasses, "space-y-8")}>
    {/* <AppBarMini /> */}
    <Container className="max-w-[1400px]">
      <HeaderMini />
    </Container>
    <Container className={cn(contentClasses, "max-w-[1400px]")}>{children}</Container>
    <Container maxWidth="max-w-full" className="pb-4 sm:pb-5 md:pb-6 lg:pb-[30px] max-w-[1400px]">
      <MiniFooter />
    </Container>
  </div>
);

export default MiniLayout;
