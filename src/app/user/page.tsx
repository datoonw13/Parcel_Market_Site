"use client";

import UserAccountTab from "@/components/user/UserAccountTab";
import UserTabs from "@/components/user/UserTabs";
import { TabsEnum } from "@/types/user";
import { useState } from "react";

const UserPage = () => {
  const [selectedTab, setSelectedTab] = useState<TabsEnum>(TabsEnum.ACCOUNT);

  return (
    <div className="flex gap-10 flex-col mb-10">
      <UserTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <UserAccountTab />
    </div>
  );
};

export default UserPage;
