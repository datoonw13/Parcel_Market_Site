import routes from "@/helpers/routes";
import { useAppSelector } from "@/lib/hooks";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "../@new/user/user-menu/UserMenu";

const HeaderMenuItems = () => {
  const pathname = usePathname();

  const user = useAppSelector((state) => state.authedUser.user);
  return (
    <Box
      sx={{
        gap: 4,
        alignItems: "center",
        "& > div > a": { fontWeight: 500, fontSize: 14, "&:hover": { color: "primary.main" }, transition: "all 0.1s" },
        display: "flex",
      }}
    >
      <Box sx={{ color: pathname.includes("/about-us") ? "primary.main" : "inherit" }}>
        <Link href="/about-us">About Us</Link>
      </Box>
      <Box>
        <Link href="/">Find a Preferred Land Agent</Link>
      </Box>
      <Box>
        <Link href="/find-property">Sell your property</Link>
      </Box>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Link href={routes.propertySearch.root}>
          <Button sx={{ textTransform: "none" }} variant="contained">
            Value my land for free
          </Button>
        </Link>
        {user ? (
          <UserMenu />
        ) : (
          <Link href={routes.auth.signIn}>
            <Button sx={{ textTransform: "none" }} variant="outlined">
              Sign In
            </Button>
          </Link>
        )}
      </Box>
    </Box>
  );
};

export default HeaderMenuItems;
