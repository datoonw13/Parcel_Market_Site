"use client";

import { FC, useRef } from "react";
import { Button } from "@/components/ui/button";
import routes from "@/helpers/routes";
import useMediaQuery from "@/hooks/useMediaQuery";
import Link from "next/link";
import { RxHamburgerMenu } from "react-icons/rx";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { IoIosLogIn, IoIosLogOut } from "react-icons/io";
import { logOutUserAction } from "@/server-actions/user/actions";
import { CiUser } from "react-icons/ci";
import { PiBellLight, PiBellRingingThin, PiClockCountdown } from "react-icons/pi";
import { IDecodedAccessToken } from "@/types/auth";
import { HiOutlineBell } from "react-icons/hi2";
import { breakPoints } from "../../../../tailwind.config";
import HeaderNotifications from "./notifications";
import UserMenu from "./user-menu";

interface HeaderMenuProps {
  user: IDecodedAccessToken | null;
}

const HeaderMenu: FC<HeaderMenuProps> = ({ user }) => {
  const burgerIconRef = useRef<HTMLButtonElement>(null);
  const { targetReached: isSmallDevice, detecting } = useMediaQuery(parseFloat(breakPoints.lg));

  return (
    !detecting && (
      <div className="flex">
        {isSmallDevice && (
          <>
            <PopoverTrigger ref={burgerIconRef}>
              <RxHamburgerMenu className="size:4 sm:size-5 cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent
              onInteractOutside={(e) => {
                if (
                  (e.type === "dismissableLayer.pointerDownOutside" && e.target && burgerIconRef.current,
                  burgerIconRef.current?.contains(e.target as any))
                ) {
                  e.preventDefault();
                }
              }}
              className="outline-none w-screen relative -translate-y-1 z-[9999]"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
                className="bg-white w-screen  !outline-none bg-red-50"
              >
                <PopoverTrigger className="absolute bg-black/50 w-screen h-screen left-0 -z-10" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: "-100%" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1 }}
                className="bg-white w-screen !outline-none p-5 border-t border-t-grey-100 flex flex-col rounded-b-xl"
              >
                <Link href={routes.volt.fullUrl} className="text-sm hover:text-primary-main py-1.5 transition-all duration-100">
                  Value of the land tool
                </Link>
                <div>
                  <p className="text-grey-600 text-xs py-4">Personal</p>
                  {!user && (
                    <Link href={routes.auth.signIn.fullUrl}>
                      <div className="flex items-center gap-1.5 cursor-pointer">
                        <IoIosLogIn color="primary-main" className="!fill-primary-main transition-all duration-0.1 size-5" />
                        <p className={cn("text-sm transition-all duration-0.1")}>Log In</p>
                      </div>
                    </Link>
                  )}
                  {!!user && (
                    <>
                      <ul>
                        <li className="flex gap-3 items-center text-sm hover:text-primary-main cursor-pointer py-1.5">
                          <CiUser className="size-5" /> My Profile
                        </li>
                        <li className="flex gap-3 items-center text-sm hover:text-primary-main cursor-pointer py-1.5">
                          <PiBellRingingThin className="size-5" /> Notifications
                        </li>
                        <li className="flex gap-3 items-center text-sm hover:text-primary-main cursor-pointer py-1.5">
                          <HiOutlineBell className="size-5" />
                          My Subscription
                        </li>
                        <li className="flex gap-3 items-center text-sm hover:text-primary-main cursor-pointer py-1.5">
                          <PiClockCountdown className="size-5" /> My Recent Searches
                        </li>
                        <li
                          className="flex gap-3 items-center text-sm text-error cursor-pointer py-1.5"
                          onClick={async () => {
                            await logOutUserAction();
                          }}
                        >
                          <IoIosLogOut className="size-5" /> Log Out
                        </li>
                      </ul>
                    </>
                  )}
                </div>
              </motion.div>
            </PopoverContent>
          </>
        )}
        {!isSmallDevice && (
          <div className="flex gap-4 items-center">
            {!!user && (
              <>
                <Link href={routes.user.recentSearches.fullUrl} className="h-fit mr-4">
                  <p className="text-sm font-medium hover:text-primary-main transition-all duration-100">My Recent Searches</p>
                </Link>
                <HeaderNotifications />
                <UserMenu user={user} />
              </>
            )}
            <Link href={routes.volt.fullUrl}>
              <Button>Value of the land tool</Button>
            </Link>
            {!user && (
              <Link href={routes.auth.signIn.fullUrl}>
                <Button variant="secondary">Sign In</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    )
  );
};

export default HeaderMenu;