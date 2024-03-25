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
    <Button classNames="xl:hidden">Value my land</Button>
    <Button classNames="hidden xl:block">Value my land for free</Button>
    <Button type="tertiary" classNames="hidden xl:block">
      <Link href="/sign-in"> Sign In</Link>
    </Button>
  </div>
);

export default LandingDesktopNavigation;
