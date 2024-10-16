import UserProfileNotifications from "@/components/@new/user/notification/profile/user-profile-notification";
import { getNotificationsAction } from "@/server-actions/notifications/actions";
import { userNotificationsValidations } from "@/zod-validations/filters-validations";
import React, { Suspense } from "react";

const ROWS_PER_PAGE = 15;

const UserNotifications = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  const data = await getNotificationsAction({ page: 1, pageSize: 1 });
  const filters = userNotificationsValidations.safeParse(searchParams);

  return (
    <div className="w-full">
      {filters.success && (
        <Suspense
          key={JSON.stringify(filters.data)}
          fallback={
            <div className="space-y-3">
              <div className="w-full h-9 animate-pulse bg-primary-main-100 rounded-lg" />
              <div className="w-full h-9 animate-pulse bg-primary-main-100 rounded-lg" />
              <div className="w-full h-9 animate-pulse bg-primary-main-100 rounded-lg" />
              <div className="w-full h-9 animate-pulse bg-primary-main-100 rounded-lg" />
              <div className="w-full h-9 animate-pulse bg-primary-main-100 rounded-lg" />
              <div className="w-full h-9 animate-pulse bg-primary-main-100 rounded-lg" />
              <div className="w-full h-9 animate-pulse bg-primary-main-100 rounded-lg" />
              <div className="w-full h-9 animate-pulse bg-primary-main-100 rounded-lg" />
              <div className="w-full h-9 animate-pulse bg-primary-main-100 rounded-lg" />
            </div>
          }
        >
          <UserProfileNotifications filters={filters.data} pageSize={ROWS_PER_PAGE} totalItems={data.data?.pagination.totalCount || 0} />
        </Suspense>
      )}
    </div>
  );
};

export default UserNotifications;
