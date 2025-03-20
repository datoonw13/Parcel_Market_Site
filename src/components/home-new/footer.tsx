import Logo from "@/icons/Logo";
import Link from "next/link";
import React from "react";
import { BiLogoFacebook } from "react-icons/bi";
import { FaLinkedinIn } from "react-icons/fa6";
import { RiTwitterXFill } from "react-icons/ri";
import routes from "@/helpers/routes";
import { Button } from "../ui/button";

const HomeFooterSection = () => (
  <div className="max-w-7xl mx-auto px-5 lg:px-8 xl:px-20 space-y-5 mt-11 md:mt-16">
    <div className="flex items-center justify-between pb-5 border-b ">
      <Logo className="w-20 sm:w-24 md:w-28" />
      <div className="flex items-center gap-2">
        <Link href="https://www.facebook.com/profile.php?id=61565654002653" target="_blank">
          <div className="border border-black size-8 rounded-full transition-all hover:bg-black/10 flex items-center justify-center">
            <BiLogoFacebook />
          </div>
        </Link>
        <Link target="_blank" href="https://x.com/account/access">
          <div className="border border-black size-8 rounded-full transition-all hover:bg-black/10 flex items-center justify-center">
            <RiTwitterXFill />
          </div>
        </Link>
        <Link target="_blank" href="https://www.linkedin.com/company/parcel-market/">
          <div className="border border-black size-8 rounded-full transition-all hover:bg-black/10 flex items-center justify-center">
            <FaLinkedinIn />
          </div>
        </Link>
      </div>
    </div>
    <ul className="[&>a]:text-grey-800 [&>a]:text-sm [&>a]:w-max gap-y-2 gap-x-9 grid grid-cols-2 sm:grid-cols-3 lg:flex lg:justify-between lg:[&>a]:px-2 lg:gap-2 lg:items-center border-b pb-5">
      <Link href={routes.aboutUs.fullUrl} className="!border-l-0 !pl-0">
        <li>About Us</li>
      </Link>
      <hr className="hidden lg:block bg-grey-50 w-[1px] h-5" />
      <Link href="#subscription">
        <li>Pricing</li>
      </Link>
      <hr className="hidden lg:block bg-grey-50 w-[1px] h-5" />
      <Link href={routes.privacyPolicy.fullUrl}>
        <li>Privacy Policy</li>
      </Link>
      <hr className="hidden lg:block bg-grey-50 w-[1px] h-5" />
      <Link href={routes.user.recentSearches.fullUrl}>
        <li>Data dashboard</li>
      </Link>
      <hr className="hidden lg:block bg-grey-50 w-[1px] h-5" />
      <Link href={routes.volt.fullUrl}>
        <li>Value of the land tool</li>
      </Link>
      <hr className="hidden lg:block bg-grey-50 w-[1px] h-5" />
      <Link href={routes.investing.fullUrl}>
        <li>Investing</li>
      </Link>
      <hr className="hidden lg:block bg-grey-50 w-[1px] h-5" />
      <Link href={routes.termsConditions.fullUrl}>
        <li>Terms of use</li>
      </Link>
      <hr className="hidden lg:block bg-grey-50 w-[1px] h-5" />
      <Link href="/">
        <li>New Feature requests</li>
      </Link>
      <hr className="hidden lg:block bg-grey-50 w-[1px] h-5" />
    </ul>
    <div className="flex items-center flex-col gap-6 sm:flex-row justify-between pb-7">
      <Link className="text-sm font-medium text-grey-600" href="mailto:support@parcelmarket.com" target="_blank">
        Support Email
      </Link>
      <p className="text-xs font-medium text-grey-600">©{new Date().getFullYear()} Parcel Market. All rights reserved.</p>
    </div>
  </div>
);

export default HomeFooterSection;
