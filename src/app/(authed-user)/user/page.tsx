"use client";

import UserAccountTab from "@/components/user/UserAccountTab";
import UserTabs from "@/components/user/UserTabs";
import routes from "@/helpers/routes";
import { useAppSelector } from "@/lib/hooks";
import { TabsEnum } from "@/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UserPage = () => {
  const router = useRouter();
  const { user, pending } = useAppSelector((state) => state.authedUser);
  const [selectedTab, setSelectedTab] = useState<TabsEnum>(TabsEnum.ACCOUNT);

  useEffect(() => {
    if (!pending && !user) {
      router.push(routes.auth.signIn);
    }
  }, [user, pending, router]);

  return (
    <div className="flex gap-10 flex-col my-10">
      <UserTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <UserAccountTab />
    </div>
  );
};

export default UserPage;
