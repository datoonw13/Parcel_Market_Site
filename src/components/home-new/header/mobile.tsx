"use client";

import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Logo from "@/icons/Logo";
import { IoMenuSharp } from "react-icons/io5";
import { motion } from "framer-motion";
import Link from "next/link";
import routes from "@/helpers/routes";
import { IoIosLogIn, IoIosLogOut } from "react-icons/io";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { logOutUserAction } from "@/server-actions/user/actions";
import { PopoverClose } from "@radix-ui/react-popover";
import { IconType } from "react-icons/lib";
import { FC } from "react";
import { useAuth } from "@/lib/auth/auth-context";

interface HomeMobileHeaderProps {
  menuList: Array<{ label: string; icon: IconType; path: string }>;
}

const HomeMobileHeader: FC<HomeMobileHeaderProps> = ({ menuList }) => {
  const pathname = usePathname();
  const { user, isAuthed } = useAuth();

  return (
    <Popover modal>
      <PopoverAnchor>
        <div className="py-4 px-5 flex items-center justify-between md:hidden">
          <Logo className="w-[86px] sm:w-24" />
          <PopoverTrigger id="header-hamburger-icon">
            <IoMenuSharp className="size-6" />
          </PopoverTrigger>
        </div>
      </PopoverAnchor>
      <PopoverContent sideOffset={0} className="w-screen rounded-b-2xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.1 }} className="!outline-none">
          <PopoverTrigger className="absolute bg-black/50 w-screen h-screen left-0 -z-10" />
          <div className="bg-white shadow-md border-t rounded-b-2xl p-5">
            <PopoverClose>
              <Link href={routes.volt.fullUrl} className="text-sm hover:text-primary-main py-1.5 transition-all duration-100">
                Value of land tool
              </Link>
            </PopoverClose>
            <div>
              <p className="text-grey-600 text-xs py-4">Personal</p>
              {!user && (
                <PopoverClose>
                  <Link href={routes.auth.signIn.fullUrl}>
                    <div className="flex items-center gap-1.5 cursor-pointer">
                      <IoIosLogIn color="primary-main" className="!fill-primary-main transition-all duration-0.1 size-5" />
                      <p className={cn("text-sm transition-all duration-0.1")}>Log In</p>
                    </div>
                  </Link>
                </PopoverClose>
              )}
              {!!user && (
                <>
                  <ul className="flex flex-col">
                    {menuList.map((el) => (
                      <Link href={el.path} key={el.path}>
                        <PopoverClose>
                          <li
                            onClick={() => {}}
                            className={cn(
                              "flex gap-3 items-center text-sm hover:text-primary-main cursor-pointer py-1.5",
                              pathname === el.path && "text-primary-main"
                            )}
                          >
                            <el.icon className="size-5" /> {el.label}
                          </li>
                        </PopoverClose>
                      </Link>
                    ))}

                    <PopoverClose>
                      <li
                        className="flex gap-3 items-center text-sm text-error cursor-pointer py-1.5"
                        onClick={async () => {
                          await logOutUserAction();
                        }}
                      >
                        <IoIosLogOut className="size-5" /> Log Out
                      </li>
                    </PopoverClose>
                  </ul>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
};

export default HomeMobileHeader;
