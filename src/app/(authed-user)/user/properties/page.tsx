import UserPropertyBox from "@/components/user/UserPropertyBox";
import React from "react";

const page = () => (
  <div className="my-[60px]">
    <h1 className="text-[#363636] font-semibold text-2xl md:text-3xl mb-8">My Listed Properties</h1>
    <div className=" flex flex-col w-full gap-10">
      <UserPropertyBox />
      <UserPropertyBox />
    </div>
  </div>
);

export default page;
