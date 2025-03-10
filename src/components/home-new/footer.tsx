import Logo from "@/icons/Logo";
import Link from "next/link";
import React from "react";
import { BiLogoFacebook } from "react-icons/bi";
import { FaLinkedinIn } from "react-icons/fa6";
import { RiTwitterXFill } from "react-icons/ri";
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
      <Link href="/" className="!border-l-0 !pl-0">
        <li>About Us</li>
      </Link>
      <hr className="hidden lg:block bg-grey-50 w-[1px] h-5" />
      <Link href="/">
        <li>Pricing</li>
      </Link>
      <hr className="hidden lg:block bg-grey-50 w-[1px] h-5" />
      <Link href="/">
        <li>Privacy Policy</li>
      </Link>
      <hr className="hidden lg:block bg-grey-50 w-[1px] h-5" />
      <Link href="/">
        <li>My recent search</li>
      </Link>
      <hr className="hidden lg:block bg-grey-50 w-[1px] h-5" />
      <Link href="/">
        <li>Value of the land tool</li>
      </Link>
      <hr className="hidden lg:block bg-grey-50 w-[1px] h-5" />
      <Link href="/">
        <li>Investing</li>
      </Link>
      <hr className="hidden lg:block bg-grey-50 w-[1px] h-5" />
      <Link href="/">
        <li>Terms of use</li>
      </Link>
      <hr className="hidden lg:block bg-grey-50 w-[1px] h-5" />
      <Link href="/">
        <li>New Feature requests</li>
      </Link>
      <hr className="hidden lg:block bg-grey-50 w-[1px] h-5" />
    </ul>
    <div className="space-y-6 flex justify-center items-center flex-col pb-7">
      <Link href="mailto:support@parcelmarket.com" target="_blank">
        <Button variant="secondary" className="w-fit bg-grey-30 hover:bg-grey-50 hover:text-black">
          Support to: support@parcelmarket.com
        </Button>
      </Link>
      <p className="text-xs font-medium text-grey-600">©{new Date().getFullYear()} Parcel Market. All rights reserved.</p>
    </div>
  </div>
);

export default HomeFooterSection;
