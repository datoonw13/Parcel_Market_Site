"use client";

import UserTabs from "@/components/user/UserTabs";
import { TabsEnum } from "@/types/user";
import { useState } from "react";

const UserPage = () => {
  const [selectedTab, setSelectedTab] = useState<TabsEnum>(TabsEnum.PROPERTIES);

  return (
    <div>
      <UserTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      qwd
    </div>
  );
};

export default UserPage;
