"use client";

import clsx from "clsx";
import routes from "@/helpers/routes";
import { logOutUserAction } from "@/server-actions/user/actions";
import { TbBellRinging } from "react-icons/tb";
import { HiOutlineUser } from "react-icons/hi2";
import { BsClockHistory } from "react-icons/bs";
import { LogoutIcon1 } from "../../icons/LogutIcons";
import UserMenuListItem from "./UserMenuListItem";
import BellOutline from "../../icons/bell-outline";

const UserMenuList = ({ listItemClasses, hideLogout, close }: { listItemClasses?: string; hideLogout?: boolean; close?: () => void }) => (
  <ul className="flex flex-col gap-4  w-fit">
    {list.map((el) => (
      <UserMenuListItem listItemClasses={listItemClasses} label={el.label} path={el.path} icon={el.icon} onClick={close} key={el.label} />
    ))}
    {!hideLogout && (
      <li
        className="flex items-center  gap-1.5 cursor-pointer group"
        onClick={async () => {
          await logOutUserAction();
        }}
      >
        <LogoutIcon1 className="fill-error transition-all duration-0.1" />
        <p className={clsx("text-xs text-error transition-all duration-0.1", listItemClasses)}>Log Out</p>
      </li>
    )}
  </ul>
);

export default UserMenuList;

const list = [
  {
    label: "My Profile",
    icon: HiOutlineUser,
    path: routes.user.profile.fullUrl,
  },
  // {
  //   label: "My Messages",
  //   icon: EnvelopeIcon,
  //   path: routes.user.messages.fullUrl,
  // },
  {
    label: "Notifications",
    icon: TbBellRinging,
    path: routes.user.notifications.fullUrl,
  },
  {
    label: "My Subscription",
    icon: BellOutline,
    path: routes.user.subscription.fullUrl,
  },
  // {
  //   label: "My Listings",
  //   icon: BookOpen,
  //   path: routes.user.properties.fullUrl,
  // },
  // {
  //   label: "My Received Offers",
  //   icon: DiscountBox,
  //   path: routes.user.offers.received.fullUrl,
  // },
  // {
  //   label: "My Sent Offers",
  //   icon: DiscountCircle,
  //   path: routes.user.offers.sent.fullUrl,
  // },
  // {
  //   label: "My Saved Properties",
  //   icon: BookOpen,
  //   path: routes.user.followedProperties.fullUrl,
  // },
  {
    label: "Data Dashboard",
    icon: BsClockHistory,
    path: routes.user.recentSearches.fullUrl,
  },
];
