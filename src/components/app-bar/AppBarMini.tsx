import Link from "next/link";
import React from "react";
import Logo from "@/icons/Logo";
import clsx from "clsx";
import ResponsiveHeaderMenu from "./ResponsiveHeaderMenu";
import Container from "../@new/shared/Container";

const AppBarMini = ({ className }: { className?: string }) => (
  <Container maxWidth="max-w-full" className="border-b border-b-grey-100 pb-4 sm:border-0 sm:pb-0">
    <div
      id="parcel-find-header"
      className={clsx("flex justify-between items-center pt-4 sm:pt-6", "md:pt-10 lg:pt-14 xl:pt-16", className)}
    >
      <Link href="/">
        <div className="w-[85px] sm:w-[110px] md:w-[125px] lg:w-[140px] cursor-pointer" id="root-header-logo">
          <Logo />
        </div>
      </Link>
      <div className="ml-auto flex sm:hidden">
        <ResponsiveHeaderMenu rootId="parcel-find-header" />
      </div>
    </div>
  </Container>
);

export default AppBarMini;
