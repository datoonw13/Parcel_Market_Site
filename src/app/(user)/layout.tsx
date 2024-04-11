"use client";

import Header from "@/components/header/Header";
import Container from "@/components/shared/Container";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const FindPropertyLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const path = usePathname();

  return (
    <Container className="bg-neutral-400 min-h-screen">
      <Header />
      {children}
    </Container>
  );
};

export default FindPropertyLayout;
