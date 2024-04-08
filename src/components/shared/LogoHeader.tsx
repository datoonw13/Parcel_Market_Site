import Logo from "@/icons/Logo";
import clsx from "clsx";
import Link from "next/link";

const LogoHeader = ({ hideLogo, classNames }: { hideLogo?: boolean; classNames?: string }) => (
  <div className={clsx("bg-neutral flex justify-center py-9 sm: py-10 md:py-12 lg: py-14 xl:py-14 2xl:py-15", classNames)}>
    <Link
      href="/"
      style={{
        pointerEvents: hideLogo ? "none" : "auto",
      }}
    >
      <div
        className={clsx(
          "w-[145px] h-[40px] sm:w-[160px] sm:h-auto md:w-[180px] lg:w-[220px] xl:w-[240px] 2xl:w-[280px]",
          hideLogo && "opacity-0"
        )}
      >
        <Logo />
      </div>
    </Link>
  </div>
);

export default LogoHeader;
