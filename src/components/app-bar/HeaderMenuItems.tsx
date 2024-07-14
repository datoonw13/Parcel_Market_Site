import routes from "@/helpers/routes";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { getUserAction } from "@/server-actions/user/actions";
import UserMenu from "../@new/user/user-menu/UserMenu";

const HeaderMenuItems = async () => {
  const user = await getUserAction();
  return (
    <Box
      sx={{
        gap: 4,
        alignItems: "center",
        "& > div > a": { fontWeight: 500, fontSize: 14, "&:hover": { color: "primary.main" }, transition: "all 0.1s" },
        display: "flex",
      }}
    >
      <Box>
        <Link href="/about-us">About Us</Link>
      </Box>
      <Box>
        <Link href="/">Find a Preferred Land Agent</Link>
      </Box>
      <Box>
        <Link href="/find-property">Sell your property</Link>
      </Box>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Link href={routes.valueLand.fullUrl}>
          <Button sx={{ textTransform: "none" }} variant="contained">
            Value my land for free
          </Button>
        </Link>
        {user ? (
          <UserMenu user={user} />
        ) : (
          <Link href={`${routes.auth.url}/${routes.auth.signIn.url}`}>
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
