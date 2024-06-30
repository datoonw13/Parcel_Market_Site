"use client";

import { AppBar } from "@/components/app-bar";
import { Footer } from "@/components/footer";
import SubscribeNow from "@/components/shared/SubscribeNow";
import useAuthCheck from "@/hooks/useAuthCheck";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";

const MainLayout = ({ children }: { children: ReactElement }) => {
  const router = useRouter();
  const { user, pending } = useAppSelector((state) => state.authedUser);
  useAuthCheck();

  return (
    <div className="flex flex-col">
      <AppBar />
      {children}
      <SubscribeNow />
      <div className="bg-white py-20 md:py-20.5" >
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
