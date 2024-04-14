"use client";

import Button from "@/components/shared/Button";
import UserNavbarMenu from "@/components/user/UserNavbarMenu";
import routes from "@/helpers/routes";
import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";

const DesktopNavigation = () => {
  const { user } = useAppSelector((state) => state.authedUser);
  return (
    <div className="w-full flex items-center justify-end gap-4 text-dark-green font-semibold">
      <Button type="none" classNames="hidden xl:block">
        Sell your property
      </Button>
      <Button type="none" classNames="hidden xl:block">
        Find a Preferred Land Agent
      </Button>
      <Button type="none" classNames="hidden xl:block">
        About Us
      </Button>
      <Link href={routes.propertySearch.root} className="hidden xl:block">
        <Button>Value my land for free</Button>
      </Link>
      {!user && (
        <Link href={routes.auth.signIn}>
          <Button type="tertiary" classNames="hidden xl:block">
            Sign In
          </Button>
        </Link>
      )}
      {user && <UserNavbarMenu />}
    </div>
  );
};

export default DesktopNavigation;
