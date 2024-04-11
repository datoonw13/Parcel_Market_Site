"use client";

import Header from "@/components/header/Header";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const FindPropertyLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const path = usePathname();

  return (
    <div className="">
      <Header />
      {children}
    </div>
  );
};

export default FindPropertyLayout;
