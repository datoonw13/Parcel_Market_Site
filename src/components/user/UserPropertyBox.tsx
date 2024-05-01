import { Calendar1, Eye, Location, Warning2 } from "iconsax-react";
import Image from "next/image";
import React from "react";
import WarningCircleIcon from "@/icons/WarningCircleIcon";
import Button from "../shared/Button";

const UserPropertyBox = () => (
  <div className="border border-[#DFDFDF] rounded-2xl p-4 md:p-8 flex flex-col gap-6 w-full">
    <div className="flex flex-col gap-3">
      <div className="flex flex-col  md:flex-row md:justify-between gap-2">
        <h1 className="text-xl md:text-2xl text-[#363636] font-medium">59-acres Property for sale available in MC CALLA, AL</h1>
        <h2 className="text-xl md:text-2xl font-semibold text-[#0E8B40]">$549,000 USD</h2>
      </div>
      <div className="flex flex-col md:flex-row md:justify-between gap-2">
        <h3 className="text-[#868686] text-sm font-medium flex items-center gap-1">
          <Location variant="Outline" color="#868686" size={17} /> McCalla, Alabama; USA
        </h3>
        <h4 className="text-[#868686] text-sm font-medium flex items-center gap-1">
          <Eye variant="Outline" color="#868686" size={17} /> Total Views: <p className="text-[black]">3456</p>
        </h4>
      </div>
    </div>
    <div className="flex flex-col md:justify-between gap-6 md:gap-8">
      <div className="w-full h-[230px] md:h-[340px] md:w-full lg:min-w-[350px] relative">
        <Image src="/no-parcel-image.png" alt="" fill />
      </div>
      <div className="flex flex-col gap-4 md:w-full">
        <h2 className="text-lg font-medium text-[#363636] md:hidden">General Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-2 items-center">
            <p className="text-sm md:text-base text-[#868686] font-semibold">Acrages:</p>
            <p className="text-sm md:text-base text-[#363636] font-extrabold">45,900 Acres</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-sm md:text-base text-[#868686] font-semibold">Owner:</p>
            <p className="text-sm md:text-base text-[#363636] font-extrabold">Davit Natelashvili</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-sm md:text-base text-[#868686] font-semibold">Parcel ID:</p>
            <p className="text-sm md:text-base text-[#363636] font-extrabold">1473434052</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-sm md:text-base text-[#868686] font-semibold">Property Type</p>
            <p className="text-sm md:text-base text-[#363636] font-extrabold">Property Type</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-sm md:text-base text-[#868686] font-semibold">Average market price:</p>
            <p className="text-sm md:text-base text-[#363636] font-extrabold">45,000,000 $</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-sm md:text-base text-[#868686] font-semibold">Requested sales price:</p>
            <p className="text-sm md:text-base text-[#363636] font-extrabold">43, 000,000 $</p>
          </div>
        </div>
      </div>
    </div>
    <div className="flex flex-col md:flex-row md:justify-between gap-8">
      <div className="flex items-center gap-2">
        <Calendar1 variant="Outline" color="#868686" size={17} />
        <p className="text-sm text-[#868686] font-medium">
          Date Posted: <span className="text-[black]">24 Apr, 2024</span>
        </p>
      </div>
      <Button classNames="!text-[#363636] hover:!text-white !font-medium !py-3 !text-sm !px-6 w-full md:w-fit">View On Map</Button>
    </div>
    <div className="bg-[#FFF4DC] p-4 rounded-lg">
      <div className="flex flex-row gap-3">
        <Warning2 size={24} color="#FFBD23" />
        <div className="flex gap-1 flex-col">
          <p className="text-[#363636] font-semibold text-sm">your application is being processed</p>
          <p className="text-xs text-[#363636]/[.9]">Site administration will contact you within 3 working days</p>
        </div>
      </div>
    </div>
  </div>
);

export default UserPropertyBox;
