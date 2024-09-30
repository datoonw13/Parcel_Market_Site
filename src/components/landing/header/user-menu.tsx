"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { logOutUserAction } from "@/server-actions/user/actions";
import { IDecodedAccessToken } from "@/types/auth";
import { useState } from "react";
import { CiUser } from "react-icons/ci";
import { HiOutlineBell } from "react-icons/hi2";
import { IoIosLogOut } from "react-icons/io";
import { PiBellRingingThin, PiClockCountdown } from "react-icons/pi";

const UserMenu = ({ user }: { user: IDecodedAccessToken }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Avatar className="group cursor-pointer">
          <AvatarFallback className=" border border-grey-100 bg-grey-30 hover:bg-grey-50 hover:border-primary-main-200 text-sm font-medium group-data-[state=open]:bg-primary-main-200">
            {`${user.firstName[0]}${user.lastName[0]}`}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="outline-none translate-y-2">
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
              <li className="flex gap-3 items-center text-xs hover:text-primary-main cursor-pointer py-1.5">
                <CiUser className="size-4" /> My Profile
              </li>
              <li className="flex gap-3 items-center text-xs hover:text-primary-main cursor-pointer py-1.5">
                <PiBellRingingThin className="size-4" /> Notifications
              </li>
              <li className="flex gap-3 items-center text-xs hover:text-primary-main cursor-pointer py-1.5">
                <HiOutlineBell className="size-4" />
                My Subscription
              </li>
              <li className="flex gap-3 items-center text-xs hover:text-primary-main cursor-pointer py-1.5">
                <PiClockCountdown className="size-4" /> My Recent Searches
              </li>
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
