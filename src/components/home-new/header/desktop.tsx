"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import routes from "@/helpers/routes";
import Logo from "@/icons/Logo";
import { cn } from "@/lib/utils";
import { logOutUserAction } from "@/server-actions/user/actions";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useState } from "react";
import { IoIosLogOut } from "react-icons/io";
import { IconType } from "react-icons/lib";
import { useAuth } from "@/lib/auth/auth-context";
import HeaderNotifications from "./notifications";

interface HomeDesktopHeaderProps {
  menuList: Array<{ label: string; icon: IconType; path: string }>;
}

const HomeDesktopHeader: FC<HomeDesktopHeaderProps> = ({ menuList }) => {
  const pathname = usePathname();
  const { user, isAuthed } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <div className="justify-between py-7 max-w-7xl mx-auto px-8 xl:px-0 w-full hidden md:flex">
      <Logo className="size-36 h-10" />
      {isAuthed ? (
        <div className="flex gap-4 items-center">
          <>
            <Link id="header-recent-searches-button" href={routes.user.recentSearches.fullUrl} className="h-fit mr-4">
              <p className="text-sm font-medium hover:text-primary-main transition-all duration-100">Data Dashboard</p>
            </Link>
            <HeaderNotifications />
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                {user ? (
                  <Avatar className="group cursor-pointer" id="header-user-icon">
                    <AvatarFallback className=" border border-grey-100 bg-grey-30 hover:bg-grey-50 hover:border-primary-main-200 text-sm font-medium group-data-[state=open]:bg-primary-main-200">
                      {`${user.firstName[0]}${user.lastName[0]}`}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="size-10 rounded-full animate-pulse bg-primary-main-100" />
                )}
              </PopoverTrigger>
              <PopoverContent className="outline-none translate-y-2">
                {user && (
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
                        {menuList.map((item) => (
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
                )}
              </PopoverContent>
            </Popover>
          </>
          <Link id="header-volt-button" href={routes.volt.fullUrl}>
            <Button>VOLT</Button>
          </Link>
        </div>
      ) : (
        <div className="flex gap-4 justify-between items-center">
          <Link id="header-volt-button" href={routes.volt.fullUrl}>
            <Button>Value of the land tool</Button>
          </Link>
          <Link id="header-volt-button" href={routes.auth.signIn.fullUrl}>
            <Button variant="secondary">Sign In</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomeDesktopHeader;
