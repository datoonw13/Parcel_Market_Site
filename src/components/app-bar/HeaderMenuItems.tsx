import routes from "@/helpers/routes";
import { useAppSelector } from "@/lib/hooks";
import { Box, Button } from "@mui/material";
import Link from "next/link";

const HeaderMenuItems = () => {
  const user = useAppSelector((state) => state.authedUser.user);
  return (
    <Box
      sx={{
        gap: 4,
        alignItems: "center",
        "& > a": { fontWeight: 500, fontSize: 14, "&:hover": { color: "primary.main" }, transition: "all 0.1s" },
        display: "flex",
      }}
    >
      <Link href="/">Sell your property</Link>
      <Link href="/">Find a Preferred Land Agent</Link>
      <Link href="/about-us">About Us</Link>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Link href={routes.propertySearch.root}>
          <Button sx={{ textTransform: "none" }} variant="contained">
            Value my land for free
          </Button>
        </Link>
        {user ? (
          <Button variant="outlined">{`${user.name.split(" ")[0]}`.toUpperCase()}</Button>
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
