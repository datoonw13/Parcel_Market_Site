import Logo from "@/icons/Logo";
import Link from "next/link";
import { Box, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import { useAppSelector } from "@/lib/hooks";
import ResponsiveHeaderMenu from "./ResponsiveHeaderMenu";
import HeaderMenuItems from "./HeaderMenuItems";
import UserMenu from "../@new/user/user-menu/UserMenu";
import Container from "../@new/shared/Container";

const AppBar = () => {
  const user = useAppSelector((state) => state.authedUser.user);

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
            <ResponsiveHeaderMenu rootId="landing-header" />
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
