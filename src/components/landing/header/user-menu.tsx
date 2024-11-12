"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import routes from "@/helpers/routes";
import { cn } from "@/lib/utils";
import { getAccessToken, logOutUserAction } from "@/server-actions/user/actions";
import { IDecodedAccessToken } from "@/types/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CiUser } from "react-icons/ci";
import { HiOutlineBell } from "react-icons/hi2";
import { IoIosLogOut } from "react-icons/io";
import { PiBellRingingThin, PiClockCountdown } from "react-icons/pi";

const UserMenu = ({ user }: { user: IDecodedAccessToken }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Avatar className="group cursor-pointer" id="header-user-icon">
          <AvatarFallback className=" border border-grey-100 bg-grey-30 hover:bg-grey-50 hover:border-primary-main-200 text-sm font-medium group-data-[state=open]:bg-primary-main-200">
            {`${user.firstName[0]}${user.lastName[0]}`}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="outline-none translate-y-2">
        <button onClick={() => getAccessToken()}>aeee</button>
        <div className="z-10 rounded-xl bg-white shadow-1 p-6 flex flex-col items-center gap-4 min-w-80">
          <Avatar className="group cursor-pointer w-16 h-16">
            <AvatarFallback className="bg-primary-main-200">{`${user.firstName[0]}${user.lastName[0]}`}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium mb-1 text-center">{`${user.firstName} ${user.lastName}`}</p>
            <p className="text-xs text-grey-600 text-center">{user.email}</p>
          </div>
          <div className="bg-grey-30 rounded-xl w-full p-4">
            <ul>
              {list.map((item) => (
                <Link href={item.path} key={item.path}>
                  <li
                    className={cn(
                      "flex gap-3 items-center text-xs hover:text-primary-main cursor-pointer py-1.5",
                      pathname === item.path && "text-primary-main"
                    )}
                  >
                    <item.icon className="size-4" /> {item.label}
                  </li>
                </Link>
              ))}
              <li
                className="flex gap-3 items-center text-xs text-error cursor-pointer py-1.5"
                onClick={async () => {
                  await logOutUserAction();
                }}
              >
                <IoIosLogOut className="size-4" /> Log Out
              </li>
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default UserMenu;

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
