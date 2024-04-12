"use client";

import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
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
    <div className="bg-white min-h-screen">
      <Container>
        <Header />
        {children}
      </Container>
      <Footer />
    </div>
  );
};

export default FindPropertyLayout;
