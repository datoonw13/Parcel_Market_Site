"use client";

import PlanBox from "@/components/@new/subscription/plan-box";
import UserProfileSectionHeader from "@/components/@new/user/UserProfileSectionHeader";
import React from "react";

const UserProfileSubscription = () => (
  <div className="w-full space-y-8">
    <div className="flex justify-between flex-col sm:flex-row gap-6">
      <UserProfileSectionHeader title="Subscription" description="Manage your subscriptions and payments" />
    </div>
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {/* <PlanBox title="14 Days" price="Free" period="14 Days" periodDesc="(No card needed)" onChange={() => {}} /> */}
      <PlanBox title="Monthly" price="$20.00" period="Per Month" selected activeUntil={new Date()} onChange={() => {}} />
      <PlanBox title="Annual" price="215.00" period="Per Year" periodDesc="(Save 10% per month)" onChange={() => {}} />
    </div>
  </div>
);

export default UserProfileSubscription;
