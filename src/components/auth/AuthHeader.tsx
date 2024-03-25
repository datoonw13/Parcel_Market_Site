import Logo from "@/icons/Logo";
import Link from "next/link";

const AuthHeader = () => (
  <div className="bg-neutral flex justify-center py-9 sm: py-10 md:py-12 lg: py-14 xl:py-14 2xl:py-15">
    <div className="w-[145px] h-[40px] sm:w-[160px] sm:h-auto md:w-[180px] lg:w-[220px] xl:w-[240px] 2xl:w-[280px]">
      <Link href="/">
        <Logo />
      </Link>
    </div>
  </div>
);

export default AuthHeader;
