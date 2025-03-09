"use client";

import useMediaQuery from "@/hooks/useMediaQuery";
import { IUserBaseInfo } from "@/types/auth";
import { CiUser } from "react-icons/ci";
import routes from "@/helpers/routes";
import { PiBellRingingThin, PiClockCountdown } from "react-icons/pi";
import { HiOutlineBell } from "react-icons/hi2";
import HomeDesktopHeader from "./desktop";
import HomeMobileHeader from "./mobile";
import { breakPoints } from "../../../../tailwind.config";

const HomeHeaderWrapper = ({ user }: { user: IUserBaseInfo | null }) => (
  <>
    <HomeMobileHeader user={user} menuList={list} />
    <HomeDesktopHeader user={user} menuList={list} />
  </>
);

export default HomeHeaderWrapper;

const list = [
  {
    label: "My Profile",
    icon: CiUser,
    path: routes.user.profile.fullUrl,
  },
  {
    label: "Notifications",
    icon: PiBellRingingThin,
    path: routes.user.notifications.fullUrl,
  },
  {
    label: "My Subscription",
    icon: HiOutlineBell,
    path: routes.user.subscription.fullUrl,
  },
  {
    label: "My Recent Searches",
    icon: PiClockCountdown,
    path: routes.user.recentSearches.fullUrl,
  },
];
