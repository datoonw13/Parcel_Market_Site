import UserProfileNotifications from "@/components/@new/user/notification/profile/user-profile-notification";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

const UserNotifications = ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  if (!searchParams.page) {
    redirect("?page=1");
  }
  return (
    <div className="w-full">
      <Suspense>
        <UserProfileNotifications searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default UserNotifications;
