import routes from "@/helpers/routes";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { getUserAction } from "@/server-actions/user/actions";
import { Suspense } from "react";
import UserMenu from "../@new/user/user-menu/UserMenu";
import UserHeaderNotificationWrapper from "../@new/user/notification/header/user-header-notifications-wrapper";
import UserHeaderNotificationButton from "../@new/user/notification/header/user-header-notification-button";

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
        <Link href="/">Find a Land Professional</Link>
      </Box>
      <Box>
        <Link href={routes.marketplace.fullUrl}>Parcel MarketPlace</Link>
      </Box>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        {user ? (
          <>
            <Suspense fallback={<UserHeaderNotificationButton loading active={false} />}>
              <UserHeaderNotificationWrapper />
            </Suspense>
            <UserMenu user={user} />
          </>
        ) : (
          <Link href={`${routes.auth.url}/${routes.auth.signIn.url}`}>
            <Button sx={{ textTransform: "none" }} variant="outlined">
              Sign In
            </Button>
          </Link>
        )}
        <Link href={routes.valueLand.fullUrl}>
          <Button sx={{ textTransform: "none" }} variant="contained">
            Get Land Values
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default HeaderMenuItems;
