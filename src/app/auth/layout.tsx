"use client";

import { AppBarMini } from "@/components/app-bar";
import { MiniFooter } from "@/components/footer";
import useAuthCheck from "@/hooks/useAuthCheck";
import { useAppSelector } from "@/lib/hooks";
import { Box, CircularProgress, Paper } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { ReactElement, useEffect } from "react";

const AuthLayout = ({ children }: { children: ReactElement }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { pending, user } = useAppSelector((state) => state.authedUser);

  useAuthCheck();

  useEffect(() => {
    if (!pending && user) {
      router.push("/");
    }
  }, [pending, router, user]);

  return pending ? (
    <Box sx={{ width: "100%", height: "100vh", display: "flex", alignItems: "center" }}>
      <CircularProgress sx={{ m: "auto" }} />
    </Box>
  ) : (
    <Box sx={{ px: { xs: 2.5, sm: 4.5, md: 6.5, lg: 8 }, display: "flex", flexDirection: "column", height: "100%" }}>
      <AppBarMini />
      <Paper
        sx={{
          maxWidth: 736,
          width: "100%",
          p: { xs: 2.5, sm: 4.5, md: 6.5, lg: 8 },
          mx: "auto",
          boxShadow: { xs: 0, sm: 1 },
          height: pathname.includes("sign-up") ? "auto" : "100%",
          borderRadius: 3,
          mt: pathname.includes("sign-up") ? "auto" : "",
        }}
      >
        {children}
      </Paper>
      <MiniFooter sx={{ mt: "auto" }} />
    </Box>
  );
};

export default AuthLayout;
