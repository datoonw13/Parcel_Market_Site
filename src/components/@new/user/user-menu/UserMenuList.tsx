"use client";

import clsx from "clsx";
import routes from "@/helpers/routes";
import { logOutUserAction } from "@/server-actions/user/actions";
import { UserIcon1 } from "../../icons/UserIcons";
import { SmsIcon1 } from "../../icons/SmsIcons";
import { BookIcon1 } from "../../icons/BookIcons";
import { DiscountIcon1, DiscountIcon2 } from "../../icons/DiscountIcons";
import { LogoutIcon1 } from "../../icons/LogutIcons";
import UserMenuListItem from "./UserMenuListItem";
import { ClockIcon3 } from "../../icons/ClockIcons";

const UserMenuList = ({ listItemClasses, hideLogout, close }: { listItemClasses?: string; hideLogout?: boolean; close?: () => void }) => (
  <ul className="flex flex-col gap-4 min-w-[306px]">
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
    icon: UserIcon1,
    path: routes.user.profile.fullUrl,
  },
  {
    label: "My Subscription",
    icon: UserIcon1,
    path: routes.user.subscription.fullUrl,
  },
  {
    label: "My Messages",
    icon: SmsIcon1,
    path: "/",
  },
  {
    label: "My Listings",
    icon: BookIcon1,
    path: routes.user.listings.fullUrl,
  },
  {
    label: "My Followed Listings",
    icon: BookIcon1,
    path: routes.user.followedProperties.fullUrl,
  },
  {
    label: "My Received Offers",
    icon: DiscountIcon1,
    path: routes.user.offers.received.fullUrl,
  },
  {
    label: "My Sent Offers",
    icon: DiscountIcon2,
    path: routes.user.offers.sent.fullUrl,
  },
  {
    label: "My Recent Searches",
    icon: ClockIcon3,
    path: routes.user.searches.fullUrl,
    requireSubscription: true,
  },
];
