import Logo from "@/icons/Logo";
import Link from "next/link";
import { Box, Container } from "@mui/material";
import ResponsiveHeaderMenu from "./ResponsiveHeaderMenu";
import HeaderMenuItems from "./HeaderMenuItems";

const AppBar = () => (
  <Box
    sx={{
      bgcolor: "white",
    }}
    id="landing-header"
  >
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        m: "auto",
        py: { xs: 2, md: 3 },
      }}
    >
      <Link href="/">
        <Box sx={{ width: { xs: 85, sm: 110, md: 125, lg: 140 }, cursor: "pointer" }} id="root-header-logo">
          <Logo />
        </Box>
      </Link>
      <Box sx={{ ml: "auto", display: { xs: "flex", lg: "none" } }}>
        <ResponsiveHeaderMenu rootId="landing-header" />
      </Box>
      <Box sx={{ display: { xs: "none", lg: "flex" } }}>
        <HeaderMenuItems />
      </Box>
    </Container>
  </Box>
);

export default AppBar;
