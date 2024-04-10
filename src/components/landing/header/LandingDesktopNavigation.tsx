"use client";

import Button from "@/components/shared/Button";
import UserNavbarMenu from "@/components/user/UserNavbarMenu";
import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";

const LandingDesktopNavigation = () => {
  const { pending, user } = useAppSelector((state) => state.authedUser);
  return (
    <div className="w-full flex items-center justify-end gap-4 text-dark-green font-semibold">
      <Button type="text" classNames="hidden xl:block">
        Sell your property
      </Button>
      <Button type="text" classNames="hidden xl:block">
        Find a Preferred Land Agent
      </Button>
      <Button type="text" classNames="hidden xl:block">
        About Us
      </Button>
      <Link href="/property-search/info" className="hidden xl:block">
        <Button>Value my land</Button>
      </Link>
      {!user && (
        <Link href="/sign-in">
          <Button loading={pending} type="tertiary" classNames="hidden xl:block">
            Sign In
          </Button>
        </Link>
      )}
      {user && <UserNavbarMenu />}
    </div>
  );
};

export default LandingDesktopNavigation;
