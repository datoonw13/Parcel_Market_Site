import React from "react";
import clsx from "clsx";
import routes from "@/helpers/routes";
import Link from "next/link";
import { UserIcon1 } from "../../icons/UserIcons";
import { SmsIcon1 } from "../../icons/SmsIcons";
import { BookIcon1 } from "../../icons/BookIcons";
import { DiscountIcon1, DiscountIcon2 } from "../../icons/DiscountIcons";
import { BookmarkIcon1 } from "../../icons/BookMarkIcons";
import { LogoutIcon1 } from "../../icons/LogutIcons";
import UserMenuListItem from "./UserMenuListItem";

const UserMenuList = ({ listItemClasses, hideLogout, close }: { listItemClasses?: string; hideLogout?: boolean; close?: () => void }) => (
  <ul className="flex flex-col gap-4 min-w-[306px]">
    {list.map((el) => (
      <UserMenuListItem listItemClasses={listItemClasses} label={el.label} path={el.path} icon={el.icon} onClick={close} key={el.label} />
    ))}
    {!hideLogout && (
      <li className="flex items-center  gap-1.5 cursor-pointer group ">
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
    path: routes.user.profile,
  },
  {
    label: "My Messages",
    icon: SmsIcon1,
    path: "/",
  },
  {
    label: "My Listings",
    icon: BookIcon1,
    path: "/",
  },
  {
    label: "Received Offers",
    icon: DiscountIcon1,
    path: "/",
  },
  {
    label: "Sent Offers",
    icon: DiscountIcon2,
    path: "/",
  },
  {
    label: "My saved properties",
    icon: BookmarkIcon1,
    path: routes.user.savedProperties,
  },
];
