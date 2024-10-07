import Link from "next/link";
import React from "react";
import Logo from "@/icons/Logo";
import { getUserAction } from "@/server-actions/user/actions";
import { Popover, PopoverAnchor } from "@/components/ui/popover";
import HeaderMenu from "@/components/landing/header/menu";
import { cn } from "@/lib/utils";

const HeaderMini = async ({ className }: { className?: string }) => {
  const user = await getUserAction();
  return (
    <Popover modal>
      <PopoverAnchor>
        <div className="border-b border-b-grey-100 pb-4 sm:border-0 sm:pb-0 max-w-full">
          <div className={cn("flex justify-between items-center pt-4 sm:pt-6", "md:pt-10 lg:pt-14 xl:pt-16", className)}>
            <Link href="/">
              <div className="w-[85px] sm:w-[110px] md:w-[125px] lg:w-[140px] cursor-pointer" id="root-header-logo">
                <Logo />
              </div>
            </Link>
            <div className="ml-auto flex sm:hidden">
              <HeaderMenu user={user} />
            </div>
          </div>
        </div>
      </PopoverAnchor>
    </Popover>
  );
};

export default HeaderMini;
