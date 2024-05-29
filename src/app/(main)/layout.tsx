import { AppBar } from "@/components/app-bar";
import { Footer } from "@/components/footer";
import SubscribeNow from "@/components/shared/SubscribeNow";
import { Box } from "@mui/material";
import { ReactElement } from "react";

const layout = ({ children }: { children: ReactElement }) => (
  <Box sx={{ display: "flex", flexDirection: "column" }}>
    <AppBar />
    {children}
    <SubscribeNow />
    <Box sx={{ bgcolor: "white", py: { xs: 10, md: 11, lg: 12.5 } }}>
      <Footer />
    </Box>
  </Box>
);

export default layout;
