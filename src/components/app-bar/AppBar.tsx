import Logo from "@/icons/Logo";
import Link from "next/link";
import { Box, Divider } from "@mui/material";
import { getUserAction } from "@/server-actions/user/actions";
import ResponsiveHeaderMenu from "./ResponsiveHeaderMenu";
import HeaderMenuItems from "./HeaderMenuItems";
import Container from "../@new/shared/Container";

const AppBar = async () => {
  const user = await getUserAction();
  return (
    <>
      <Box
        sx={{
          bgcolor: "white",
        }}
        id="landing-header"
      >
        <Container className="flex items-center justify-between m-auto py-4 md:py-6">
          <Link href="/">
            <Box sx={{ width: { xs: 85, sm: 110, md: 125, lg: 140 }, cursor: "pointer" }} id="root-header-logo">
              <Logo />
            </Box>
          </Link>
          <Box sx={{ ml: "auto", display: { xs: "flex", lg: "none" } }}>
            <ResponsiveHeaderMenu user={user} rootId="landing-header" />
          </Box>
          <Box sx={{ display: { xs: "none", lg: "flex" } }}>
            <HeaderMenuItems />
          </Box>
        </Container>
      </Box>
      <Divider />
    </>
  );
};

export default AppBar;
