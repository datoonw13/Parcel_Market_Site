import Button from "@/components/shared/Button";

const LandingNavigation = () => (
  <ul className="w-full flex items-center justify-end gap-4 text-dark-green font-semibold">
    <li className="cursor-pointer px-4">Sell your property</li>
    <li className="cursor-pointer px-4">Find a Preferred Land Agent</li>
    <li className="cursor-pointer px-4">About Us</li>
    <li className="cursor-pointer">
      <Button>Value my land for free</Button>
    </li>
    <li className="cursor-pointer">
      <Button type="tertiary">Sign In</Button>
    </li>
  </ul>
);

export default LandingNavigation;
