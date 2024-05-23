"use client";

import Header from "@/components/header/Header";
// import Footer from "@/components/Footer";
import Container from "@/components/shared/Container";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAppSelector } from "@/lib/hooks";
import routes from "@/helpers/routes";

const FindPropertyLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const path = usePathname();
  const router = useRouter();
  const { user, pending } = useAppSelector((state) => state.authedUser);

  useEffect(() => {
    if (!pending && !user) {
      router.push(routes.auth.signIn);
    }
  }, [user, pending, router]);
  return (
    <div className="bg-white min-h-screen">
      <Container>
        <Header />
        {children}
      </Container>
      {/* <Footer /> */}
    </div>
  );
};

export default FindPropertyLayout;
