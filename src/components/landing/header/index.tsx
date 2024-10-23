import Logo from "@/icons/Logo";
import Link from "next/link";
import routes from "@/helpers/routes";
import { Popover, PopoverAnchor } from "@/components/ui/popover";
import { IDecodedAccessToken } from "@/types/auth";
import HeaderMenu from "./menu";

const LandingHeader = ({ user }: { user: IDecodedAccessToken | null }) => (
  <Popover modal>
    <PopoverAnchor>
      <div
        className={`
          py-3 sm:py-4 md:py-5 lg:py-6 xl:py-7 
          flex justify-between items-center
          mx-auto
          px-5 sm:px-8 md:px-11 lg:px-16 xl:px-[11vw]
          border-b border-b-grey-100
          `}
        id="root-header"
      >
        <Link href={routes.home.fullUrl} id="landing-header-logo">
          <Logo className="w-[85px] h-6 sm:w-24 sm:h-8 md:w-32 md:h-8 lg:w-[140px] lg:h-10 " />
        </Link>
        <HeaderMenu user={user} />
      </div>
    </PopoverAnchor>
  </Popover>
);
export default LandingHeader;
