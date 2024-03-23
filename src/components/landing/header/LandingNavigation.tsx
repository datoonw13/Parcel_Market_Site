import Button from "@/components/shared/Button";

const LandingNavigation = () => (
  <div className="w-full flex items-center justify-end gap-4 text-dark-green font-semibold">
    <Button type="text">Sell your property</Button>
    <Button type="text">Find a Preferred Land Agent</Button>
    <Button type="text">About Us</Button>
    <Button>Value my land for free</Button>
    <Button type="tertiary">Sign In</Button>
  </div>
);

export default LandingNavigation;
