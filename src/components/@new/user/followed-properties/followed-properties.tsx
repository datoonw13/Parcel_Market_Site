"use client";

import { FC, ReactNode } from "react";
import { IUserBaseInfo } from "@/types/auth";
import routes from "@/helpers/routes";
import Link from "next/link";
import { IoAddOutline } from "react-icons/io5";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { userPropertiesFiltersValidations } from "@/zod-validations/filters-validations";
import UserProfileSectionHeader from "../UserSectionHeading";
import Button from "../../shared/forms/Button";
import SubscribeError from "../../shared/subscribe-error";
import UserFollowerPropertiesFilter from "./filters/filters";

interface FollowedPropertiesProps {
  user: IUserBaseInfo | null;
  totalItems: number;
  children: ReactNode;
  filters: z.infer<typeof userPropertiesFiltersValidations>;
}
const FollowedProperties: FC<FollowedPropertiesProps> = ({ user, totalItems, children, filters }) => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();
  const pathname = usePathname();

  const onChange = <T extends keyof z.infer<typeof userPropertiesFiltersValidations>>(data: {
    [key in T]: z.infer<typeof userPropertiesFiltersValidations>[T];
  }) => {
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
      <UserProfileSectionHeader
        title="My Saved Properties"
        description="View and manage the properties you've bookmarked for future consideration."
      />
      <UserFollowerPropertiesFilter onChange={onChange} selectedFilters={filters} totalItems={totalItems} user={user} />
      {user?.isSubscribed ? <>{children}</> : <SubscribeError />}
    </div>
  );
};
export default FollowedProperties;
