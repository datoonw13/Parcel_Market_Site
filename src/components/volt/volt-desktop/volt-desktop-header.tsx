import Logo from "@/icons/Logo";
import Link from "next/link";

const VoltDesktopHeader = () => (
  <div className="px-14 xl:px-16 pt-14 xl:pt-16 pb-14">
    <Link href="/">
      <Logo className="w-[141px] h-10" />
    </Link>
  </div>
);

export default VoltDesktopHeader;
