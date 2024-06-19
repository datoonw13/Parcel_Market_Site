import React from "react";
import { UserIcon1 } from "../../icons/UserIcons";
import { SmsIcon1 } from "../../icons/SmsIcons";
import { BookIcon1 } from "../../icons/BookIcons";
import { DiscountIcon1, DiscountIcon2 } from "../../icons/DiscountIcons";
import { BookmarkIcon1 } from "../../icons/BookMarkIcons";
import { LogoutIcon1 } from "../../icons/LogutIcons";

const UserMenuList = () => (
  <ul className="flex flex-col gap-4">
    {list.map((el) => (
      <li key={el.label} className="flex items-center  gap-1.5 cursor-pointer group ">
        <el.icon className="group-hover:fill-primary-main transition-all duration-0.1" />
        <p className="text-xs group-hover:text-primary-main transition-all duration-0.1">{el.label}</p>
      </li>
    ))}
    <li className="flex items-center  gap-1.5 cursor-pointer group ">
      <LogoutIcon1 className="fill-error transition-all duration-0.1" />
      <p className="text-xs text-error transition-all duration-0.1">Log Out</p>
    </li>
  </ul>
);

export default UserMenuList;

const list = [
  {
    label: "My Profile",
    icon: UserIcon1,
  },
  {
    label: "My Messages",
    icon: SmsIcon1,
  },
  {
    label: "My Listings",
    icon: BookIcon1,
  },
  {
    label: "Received Offers",
    icon: DiscountIcon1,
  },
  {
    label: "Sent Offers",
    icon: DiscountIcon2,
  },
  {
    label: "My saved properties",
    icon: BookmarkIcon1,
  },
];
