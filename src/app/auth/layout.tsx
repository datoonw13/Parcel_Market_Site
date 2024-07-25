import { LogoIcon1 } from "@/components/@new/icons/LogoIcons";
import MiniLayout from "@/components/@new/shared/mini-layout";
import { MiniFooter } from "@/components/footer";
import routes from "@/helpers/routes";
import Link from "next/link";
import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => (
  // <div
  //   className="px-5 sm:px-6 md:px-10 lg:px-12 xl:px-16 pt-5 sm:pt-6 md:pt-10
  // lg:pt-12 xl:pt-16 pb-4 sm:pb-5 md:pb-6 lg:pb-7 xl:pb-[30px] flex flex-col bg-white sm:bg-grey-30 min-h-screen"
  // >
  //   <Link href={`/${routes.home.url}`}>
  //     <LogoIcon1 className="w-[85px] h-6 sm:w-[95px] sm:h-7 md:w-28 md:h-8 lg:w-[141px] lg:h-10" />
  //   </Link>
  //   <div className="bg-white rounded-2xl max-w-[736px] w-full h-full mx-auto my-auto">{children}</div>
  //   <MiniFooter />
  // </div>
  <MiniLayout>{children}</MiniLayout>
);

export default AuthLayout;
