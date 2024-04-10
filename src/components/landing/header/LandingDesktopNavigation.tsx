import Button from "@/components/shared/Button";
import Link from "next/link";

const LandingDesktopNavigation = () => (
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
    <Link href="/property-search/info" className="xl:hidden">
      <Button>Value my land</Button>
    </Link>
    <Link href="/property/info" className="hidden xl:block">
      <Button>Value my land for free</Button>
    </Link>
    <Link href="/sign-in">
      <Button type="tertiary" classNames="hidden xl:block">
        Sign In
      </Button>
    </Link>
  </div>
);

export default LandingDesktopNavigation;
