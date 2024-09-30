import Logo from "@/icons/Logo";
import Link from "next/link";
import routes from "@/helpers/routes";
import { Popover, PopoverAnchor } from "@/components/ui/popover";
import { getUserAction } from "@/server-actions/user/actions";
import HeaderMenu from "./menu";

const LandingHeader = async () => {
  const user = await getUserAction();
  return (
    <Popover>
      <PopoverAnchor>
        <div className="py-3 sm:py-4 md:py-5 lg:py-6 xl:py-7 px-5 sm:px-8 md:px-14 lg:px-24 xl:px-36 2xl:px-40 flex justify-between items-center max-w-8xl mx-auto ">
          <Link href={routes.home.fullUrl}>
            <Logo className="w-[85px] h-6 sm:w-24 sm:h-8 md:w-32 md:h-8 lg:w-[140px] lg:h-10 " />
          </Link>
          <HeaderMenu user={user} />
        </div>
      </PopoverAnchor>
    </Popover>
  );
};

export default LandingHeader;
