"use client";

import UserPropertyBox from "@/components/user/UserPropertyBox";
import LoadingCircle from "@/icons/LoadingCircle";
import { useGetUserSellingPropertiesQuery } from "@/lib/features/apis/propertyApi";
import React from "react";

const UserSellingProperties = () => {
  const { data, isFetching, isLoading } = useGetUserSellingPropertiesQuery();
  return (
    <div className="my-[60px]">
      <h1 className="text-[#363636] font-semibold text-2xl md:text-3xl mb-8">My Listed Properties</h1>
      <div className=" flex flex-col w-full gap-10">
        {(isFetching || isLoading) && (
          <div className="w-[260px] flex m-auto">
            <LoadingCircle />
          </div>
        )}
        {data?.data.sellingProperties.map((el) => (
          <UserPropertyBox key={el.parcelNumber} data={el} />
        ))}
      </div>
    </div>
  );
};

export default UserSellingProperties;
