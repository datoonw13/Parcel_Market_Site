import Logo from "@/icons/Logo";
import { IDecodedAccessToken } from "@/types/auth";
import ResponsiveHeaderMenu from "../app-bar/ResponsiveHeaderMenu";

const styles = {
  paddingT: "pt-4 md:pt-12 lg:pt-16",
  paddingB: "pb-4 md:pb-6",
  paddingX: "px-5 md:px-12 lg:px-16",
  general: "flex justify-between items-center",
};

const stringifiedStyles = Object.values(styles).join(" ");

const VoltHeader = ({ user }: { user: IDecodedAccessToken | null }) => (
  <div className={stringifiedStyles} id="volt-header">
    <div className="w-[85px] h-6 md:w-28 md:h-8 lg:w-36 lg:h-10">
      <Logo />
    </div>
    <div className="lg:hidden">
      <ResponsiveHeaderMenu rootId="volt-header" user={user} />
    </div>
  </div>
);

export default VoltHeader;
