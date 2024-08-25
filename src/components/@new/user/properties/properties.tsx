"use client";

import { FC } from "react";
import { IDecodedAccessToken } from "@/types/auth";
import routes from "@/helpers/routes";
import Link from "next/link";
import { IoAddOutline } from "react-icons/io5";
import UserProfileSectionHeader from "../UserProfileSectionHeader";
import Button from "../../shared/forms/Button";
import SubscribeError from "../../shared/subscribe-error";
import UserPropertiesFilters from "./filters/filters";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { userPropertiesFiltersValidations } from "@/zod-validations/filters-validations";

interface PropertiesProps {
  user: IDecodedAccessToken | null;
  totalItems: number;
}
const Properties: FC<PropertiesProps> = ({ user, totalItems }) => {
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const router = useRouter()
  const pathname = usePathname()

  const selectedFilters: z.infer<typeof userPropertiesFiltersValidations> = {
    states: searchParams.get("states")?.split(",") || null,
    counties: searchParams.get("counties")?.split(",") || null,
    page: Number(searchParams.get("page")) || 1,
    sortBy: (searchParams.get("sortBy") as any) || null,
    voltPriceMin: Number(searchParams.get("voltPriceMin")) || null,
    voltPriceMax: Number(searchParams.get("voltPriceMax")) || null,
    acreageMin: Number(searchParams.get("acreageMin")) || null,
    acreageMax: Number(searchParams.get("acreageMax")) || null,
  };

  const onChange = <T extends keyof z.infer<typeof userPropertiesFiltersValidations>>(data: { [key in T]: z.infer<typeof userPropertiesFiltersValidations>[T] }) => {
    Object.keys(data).forEach((key) => {
      const value = data[key as T];
      if (value) {
        const filterValue = Array.isArray(value) ? value.join(",") : value.toString();
        params.set(key, filterValue);
      } else {
        params.delete(key);
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between flex-col sm:flex-row gap-6">
        <UserProfileSectionHeader title="My Listings" description="Welcome to Parcel Market and thank You for being here" />
        {user?.isSubscribed && (
          <Link href={routes.valueLand.fullUrl} className="w-full sm:w-fit">
            <Button className="!bg-primary-main-100 w-full sm:w-fit">
              <div className="flex items-center gap-2  text-primary-main">
                <IoAddOutline className="text-primary-main size-5" /> Add Land
              </div>
            </Button>
          </Link>
        )}
      </div>
      <UserPropertiesFilters onChange={onChange} selectedFilters={selectedFilters} totalItems={totalItems} user={user} />
      {user?.isSubscribed ? <>asas</> : <SubscribeError />}
    </div>
  );
  
}
export default Properties;
