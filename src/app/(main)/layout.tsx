"use client";

import { AppBar } from "@/components/app-bar";
import { Footer } from "@/components/footer";
import SubscribeNow from "@/components/shared/SubscribeNow";
import routes from "@/helpers/routes";
import useAuthCheck from "@/hooks/useAuthCheck";
import { useAppSelector } from "@/lib/hooks";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { ReactElement, useEffect } from "react";

const MainLayout = ({ children }: { children: ReactElement }) => {
  const router = useRouter();
  const { user, pending } = useAppSelector((state) => state.authedUser);
  useAuthCheck();

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <AppBar />
      {children}
      <SubscribeNow />
      <Box sx={{ bgcolor: "white", py: { xs: 10, md: 11, lg: 12.5 } }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default MainLayout;
