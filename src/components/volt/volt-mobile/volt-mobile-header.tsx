import ResponsiveHeaderMenu from "@/components/app-bar/ResponsiveHeaderMenu";
import Logo from "@/icons/Logo";
import { IDecodedAccessToken } from "@/types/auth";
import { VoltSteps } from "@/types/volt";
import Link from "next/link";
import React from "react";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

const VoltMobileHeader = ({ step, user, goBack }: { goBack: () => void; step: VoltSteps; user: IDecodedAccessToken | null }) => (
  <div className="w-full" id="volt-navbar">
    <div className="px-5 py-6 border-b border-b-grey-100 flex justify-between items-center">
      {step !== VoltSteps.SEARCH && <MdOutlineKeyboardArrowLeft onClick={goBack} className="size-6" />}
      <Link href="/">
        <Logo className="w-[84px] h-6 sm:w-24 sm:h-8" />
      </Link>
      <ResponsiveHeaderMenu user={user} rootId="volt-navbar" />
    </div>
  </div>
);

export default VoltMobileHeader;
